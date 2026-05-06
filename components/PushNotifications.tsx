"use client";

import { useEffect, useRef, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function PushNotifications() {
  const hasInitialized = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(false);

  /* 🔥 Always initialize messaging */
  useEffect(() => {
    async function setup() {
      const messaging = await getFirebaseMessaging();

      if (!messaging) return;

      /* 🔥 Foreground listener */
      onMessage(messaging, (payload) => {
        console.log("📩 Foreground message:", payload);
      });

      /* 🔥 Check notification state */
      if (
        Notification.permission === "granted" ||
        localStorage.getItem("notifications-enabled") === "true"
      ) {
        setEnabled(true);

        /* 🔥 Hide button only */
        setHidden(true);
      }
    }

    setup();
  }, []);

  const enablePush = async () => {
    try {
      if (hasInitialized.current) {
        alert("Notifications already enabled");
        return;
      }

      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        alert("Push not supported on this device");
        return;
      }

      /* 🔥 iOS requires click-trigger */
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

      console.log("🔥 PUSH TOKEN:", clean);

      /* 🔥 SAVE TOKEN */
      await fetch("/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: clean }),
      });

      localStorage.setItem("notifications-enabled", "true");

      hasInitialized.current = true;

      setEnabled(true);

      alert("✅ Notifications enabled!");

      /* 🔥 Hide AFTER success */
      setTimeout(() => {
        setHidden(true);
      }, 1000);

    } catch (err) {
      console.error("Push error:", err);
      alert("Push error — check console");
    }
  };

  /* 🔥 Only hide VISUAL button */
  if (hidden) return null;

  return (
    <button
      onClick={enablePush}
      style={{
        padding: "12px 20px",
        background: enabled ? "#2ecc71" : "#ff7a00",
        borderRadius: "8px",
        color: "#000",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {enabled ? "Notifications Enabled ✅" : "Enable Notifications 🔔"}
    </button>
  );
}