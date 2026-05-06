"use client";

import { useEffect, useRef } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function PushNotifications() {
  const hasInitialized = useRef(false);

  // 🔥 Setup foreground listener ONCE
  useEffect(() => {
    async function setup() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        console.log("📩 Foreground message:", payload);
      });
    }

    setup();
  }, []);

  const enablePush = async () => {
    try {
      // 🔥 Prevent multiple runs
      if (hasInitialized.current) {
        alert("Notifications already enabled on this device");
        return;
      }

      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        alert("Push not supported");
        return;
      }

      // 🔥 iOS requires user-triggered request
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Permission denied");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey:
          "BNuJ8PIqjB4vxPIpRtz26judiC3T9Cy_AbAXaZNY8EyoHVvpGtiV9A-zgQ6nOPFHYBFKKvvmRbS0MOzVlgNn4yE",
      });

      if (!token) {
        alert("Failed to get token");
        return;
      }

      const clean = token.trim();

      // 🔥 Show clean token for copy
      prompt("COPY TOKEN (LONG PRESS)", clean);

      console.log("🔥 PUSH TOKEN:", clean);

      hasInitialized.current = true;

      // 🔥 (NEXT STEP) send to backend automatically
      // await fetch("/api/save-token", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ token: clean }),
      // });

    } catch (err) {
      console.error("Push error:", err);
      alert("Push error — check console");
    }
  };

  return (
    <button
      onClick={enablePush}
      style={{
        padding: "12px 20px",
        background: "#ff7a00",
        borderRadius: "8px",
        color: "#000",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
      }}
    >
      Enable Notifications 🔔
    </button>
  );
}