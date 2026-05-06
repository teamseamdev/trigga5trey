"use client";

import { useEffect, useRef, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function PushNotifications() {
  const hasInitialized = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 🔥 Check existing notification status */
  useEffect(() => {
    const checkPermission = async () => {
      if (typeof window === "undefined") return;

      const alreadyEnabled =
        Notification.permission === "granted" ||
        localStorage.getItem("notifications-enabled") === "true";

      setEnabled(alreadyEnabled);
      setLoading(false);
    };

    checkPermission();
  }, []);

  /* 🔥 Foreground listener */
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
      if (hasInitialized.current) {
        return;
      }

      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        alert("Push notifications are not supported on this device.");
        return;
      }

      /* 🔥 iOS requires click-trigger */
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Notification permission denied.");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey:
          "BNuJ8PIqjB4vxPIpRtz26judiC3T9Cy_AbAXaZNY8EyoHVvpGtiV9A-zgQ6nOPFHYBFKKvvmRbS0MOzVlgNn4yE",
      });

      if (!token) {
        alert("Failed to retrieve push token.");
        return;
      }

      const clean = token.trim();

      console.log("🔥 PUSH TOKEN:", clean);

      /* 🔥 SAVE TOKEN */
      await fetch("/api/save-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: clean,
        }),
      });

      /* 🔥 Store locally */
      localStorage.setItem("notifications-enabled", "true");

      hasInitialized.current = true;

      /* 🔥 Success animation */
      setShowSuccess(true);

      setTimeout(() => {
        setEnabled(true);
      }, 1500);

    } catch (err) {
      console.error("Push error:", err);
      alert("Push error — check console");
    }
  };

  /* 🔥 Prevent hydration flicker */
  if (loading) return null;

  /* 🔥 Hide permanently once enabled */
  if (enabled) return null;

  /* 🔥 Success state before fade */
  if (showSuccess) {
    return (
      <div
        style={{
          padding: "12px 20px",
          background: "#2ecc71",
          borderRadius: "8px",
          color: "#000",
          fontWeight: 700,
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
      >
        🔔 Notifications Enabled
      </div>
    );
  }

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
        transition: "all 0.2s ease",
      }}
    >
      Enable Notifications 🔔
    </button>
  );
}