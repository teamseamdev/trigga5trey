"use client";

import { useState } from "react";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthed(true);
    } else {
      alert("❌ Wrong password");
    }
  };

  const sendNotification = async () => {
    if (!title || !body) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert(`✅ Sent to ${data.sent} users`);
      setTitle("");
      setBody("");
    } else {
      alert("❌ Failed");
    }
  };

  /* 🔒 LOGIN SCREEN */
  if (!authed) {
    return (
      <main style={wrapper}>
        <h1>🔒 Admin Login</h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={login} style={button}>
          Login
        </button>
      </main>
    );
  }

  /* 📢 ADMIN PANEL */
  return (
    <main style={wrapper}>
      <h1>📊 Admin Panel</h1>

      <input
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={input}
      />

      <textarea
        placeholder="Notification Message"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ ...input, height: 100 }}
      />

      <button onClick={sendNotification} style={button}>
        {loading ? "Sending..." : "Send Notification 🚀"}
      </button>
    </main>
  );
}

/* 🔥 STYLES */

const wrapper = {
  maxWidth: "500px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
  padding: "20px",
  color: "#fff",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  padding: "14px",
  background: "#ff7a00",
  borderRadius: "8px",
  color: "#000",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};