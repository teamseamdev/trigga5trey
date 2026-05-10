"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  RoomEvent,
} from "livekit-client";

import {
  useRoomContext,
} from "@livekit/components-react";

import {
  useSession,
} from "next-auth/react";

type ChatMessage = {
  user: string;

  message: string;

  timestamp: number;
};

export default function LiveChat() {
  const room =
    useRoomContext();

  const { data: session } =
    useSession();

  const [messages, setMessages] =
    useState<ChatMessage[]>(
      []
    );

  const [input, setInput] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement>(
      null
    );

  /* 🔥 AUTO SCROLL */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  /* 🔥 RECEIVE CHAT */

  useEffect(() => {
    const handleMessage =
      (
        payload: Uint8Array
      ) => {
        try {
          const decoded =
            new TextDecoder().decode(
              payload
            );

          const parsed =
            JSON.parse(decoded);

          if (
            parsed.type !==
            "chat"
          ) {
            return;
          }

          setMessages(
            (prev) => [
              ...prev,
              parsed,
            ]
          );
        } catch (err) {
          console.error(
            "❌ CHAT PARSE ERROR",
            err
          );
        }
      };

    room.on(
      RoomEvent.DataReceived,
      handleMessage
    );

    return () => {
      room.off(
        RoomEvent.DataReceived,
        handleMessage
      );
    };
  }, [room]);

  /* 🔥 SEND MESSAGE */

  const sendMessage =
    async () => {
      if (!input.trim()) {
        return;
      }

      try {
        const messageData = {
          type: "chat",

          user:
            session?.user
              ?.name ||
            "Anonymous",

          message:
            input.trim(),

          timestamp:
            Date.now(),
        };

        await room.localParticipant.publishData(
          new TextEncoder().encode(
            JSON.stringify(
              messageData
            )
          )
        );

        setMessages(
          (prev) => [
            ...prev,
            messageData,
          ]
        );

        setInput("");
      } catch (err) {
        console.error(
          "❌ SEND FAILED",
          err
        );
      }
    };

  return (
    <div
      style={{
        width: "100%",

        height: "100%",

        display: "flex",

        flexDirection:
          "column",

        background:
          "#0f0f0f",

        borderLeft:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* 🔥 HEADER */}

      <div
        style={{
          padding: "16px",

          borderBottom:
            "1px solid rgba(255,255,255,0.08)",

          fontWeight: 800,

          fontSize: "1rem",
        }}
      >
        💬 LIVE CHAT
      </div>

      {/* 🔥 MESSAGES */}

      <div
        style={{
          flex: 1,

          overflowY: "auto",

          padding: "16px",

          display: "flex",

          flexDirection:
            "column",

          gap: "10px",
        }}
      >
        {messages.map(
          (msg, index) => (
            <div
              key={index}
              style={{
                wordBreak:
                  "break-word",
              }}
            >
              <span
                style={{
                  fontWeight: 800,

                  color:
                    "#18c964",
                }}
              >
                {msg.user}
              </span>

              <span
                style={{
                  marginLeft:
                    "8px",

                  color:
                    "#fff",
                }}
              >
                {msg.message}
              </span>
            </div>
          )
        )}

        <div
          ref={
            messagesEndRef
          }
        />
      </div>

      {/* 🔥 INPUT */}

      <div
        style={{
          padding: "16px",

          borderTop:
            "1px solid rgba(255,255,255,0.08)",

          display: "flex",

          gap: "10px",
        }}
      >
        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key ===
              "Enter"
            ) {
              sendMessage();
            }
          }}
          placeholder="Send a message..."
          style={{
            flex: 1,

            background:
              "#1a1a1a",

            border:
              "1px solid rgba(255,255,255,0.1)",

            color: "#fff",

            borderRadius:
              "12px",

            padding:
              "12px",
          }}
        />

        <button
          onClick={
            sendMessage
          }
          style={{
            background:
              "#18c964",

            border: "none",

            color: "#fff",

            fontWeight: 800,

            borderRadius:
              "12px",

            padding:
              "0 18px",

            cursor:
              "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}