importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCwLhXS5njt4kCoRJ9xwQpMnL0l_2eUy1I",
  authDomain: "trigga5trey.firebaseapp.com",
  projectId: "trigga5trey",
  messagingSenderId: "576191455630",
  appId: "1:576191455630:web:4c9a7e99ed1d4f1edbc4df",
});

const messaging = firebase.messaging();

/* 🔥 Handle notification clicks */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {

      /* 🔥 Focus existing window */
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      /* 🔥 Open new window */
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});