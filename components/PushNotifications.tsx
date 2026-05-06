"use client";

import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function PushNotifications() {
  const enablePush = async () => {
    try {
      const messaging = await getFirebaseMessaging();

      if (!messaging) {
        alert("Push not supported");
        return;
      }

      // 🔥 MUST be user-triggered on iOS
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Permission denied");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: "BNuJ8PIqjB4vxPIpRtz26judiC3T9Cy_AbAXaZNY8EyoHVvpGtiV9A-zgQ6nOPFHYBFKKvvmRbS0MOzVlgNn4yE",
      });

      alert("🔥 TOKEN:\n\n" + token);
      console.log("🔥 PUSH TOKEN:", token);

      // 🔥 Foreground notifications
      onMessage(messaging, (payload) => {
        const title = payload.notification?.title || "Notification";

        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body: payload.notification?.body,
            icon: "/icon-192.png",
          });
        });
      });

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