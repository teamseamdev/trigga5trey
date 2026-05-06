"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);

 /* 🔥 Check existing session */
useEffect(() => {
  const checkSession = async () => {
    try {
      const res = await fetch("/api/admin-session");

      if (res.ok) {
        setAuthed(true);
      }

    } catch (err) {
      console.error(err);
    }

    setCheckingAuth(false);
  };

  checkSession();
}, []);

  const login = async () => {
    try {
      const res = await fetch("/api/admin-auth", {
  credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAuthed(true);
        setPassword("");
      } else {
        alert("❌ Wrong password");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const logout = () => {
    document.cookie =
      "trigga5trey_admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setAuthed(false);
  };

  const sendNotification = async () => {
    if (!title || !body) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/broadcast", {
  credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          url: "/live",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Sent to ${data.sent} users`);

        setTitle("");
        setBody("");
      } else {
        alert("❌ Failed");
      }

    } catch (err) {
      console.error(err);
      alert("Send failed");
    }

    setLoading(false);
  };

  /* 🔥 Prevent hydration flicker */
  if (checkingAuth) return null;

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
      <div style={headerRow}>
        <h1>📊 Admin Panel</h1>

        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </div>

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
        style={{
          ...input,
          height: 120,
          resize: "none",
        }}
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
  margin: "0 auto",
  minHeight: "100vh",
  padding: "80px 20px 40px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
  color: "#fff",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
};

const button = {
  padding: "14px",
  background: "#ff7a00",
  borderRadius: "10px",
  color: "#000",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const logoutButton = {
  padding: "10px 14px",
  background: "#222",
  borderRadius: "8px",
  color: "#fff",
  border: "1px solid #333",
  cursor: "pointer",
};