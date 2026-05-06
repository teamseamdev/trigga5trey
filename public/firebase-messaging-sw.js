importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:  "AIzaSyCwLhXS5njt4kCoRJ9xwQpMnL0l_2eUy1I",
  authDomain:  "trigga5trey.firebaseapp.com",
  projectId: "trigga5trey",
  messagingSenderId:  "576191455630",
  appId: "1:576191455630:web:4c9a7e99ed1d4f1edbc4df",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png",
  });
});