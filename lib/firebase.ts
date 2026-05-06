import { initializeApp, getApps, getApp } from "firebase/app";

import {
  getMessaging,
  isSupported,
} from "firebase/messaging";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwLhXS5njt4kCoRJ9xwQpMnL0l_2eUy1I",
  authDomain: "trigga5trey.firebaseapp.com",
  projectId: "trigga5trey",
  storageBucket: "trigga5trey.firebasestorage.app",
  messagingSenderId: "576191455630",
  appId: "1:576191455630:web:4c9a7e99ed1d4f1edbc4df",
};

/* ✅ Prevent duplicate apps (important for Next.js) */
const app =
  getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

/* 🔥 Firestore */
export const db = getFirestore(app);

/* 🔥 Messaging (browser-safe) */
export async function getFirebaseMessaging() {
  const supported = await isSupported();

  if (!supported) return null;

  return getMessaging(app);
}