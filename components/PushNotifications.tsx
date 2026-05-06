"use client";

import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function PushNotifications() {
  useEffect(() => {
    async function init() {
      try {
        const messaging = await getFirebaseMessaging();

        if (!messaging) {
          console.log("❌ Push not supported");
          return;
        }

        // 🔥 Request permission
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("❌ Permission denied");
          return;
        }

        // 🔥 Get token
        const token = await getToken(messaging, {
          vapidKey: "BNuJ8PIqjB4vxPIpRtz26judiC3T9Cy_AbAXaZNY8EyoHVvpGtiV9A-zgQ6nOPFHYBFKKvvmRbS0MOzVlgNn4yE",
        });

        console.log("🔥 PUSH TOKEN:", token);

        // 🔥 OPTIONAL (NEXT STEP): send token to backend
        // await fetch("/api/save-token", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ token }),
        // });

        // 🔥 HANDLE FOREGROUND NOTIFICATIONS (THIS WAS MISSING)
        onMessage(messaging, (payload) => {
  console.log("📩 Foreground message:", payload);

  const title = payload.notification?.title || "Notification";
  const options = {
    body: payload.notification?.body,
    icon: "/icon-192.png",
  };

  // 🔥 FORCE notification using service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, options);
    });
  }
});
      } catch (err) {
        console.error("❌ Push error:", err);
      }
    }

    init();
  }, []);

  return null;
}