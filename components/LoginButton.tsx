"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  /* 🔥 Loading */
  if (status === "loading") {
    return (
      <button style={loadingButton}>
        Loading...
      </button>
    );
  }

  /* 🔥 Logged in */
  if (session?.user) {
    const avatar =
      session.user.avatar &&
      `https://cdn.discordapp.com/avatars/${session.user.id}/${session.user.avatar}.png`;

    return (
      <div style={userWrap}>
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            style={avatarStyle}
          />
        )}

        <div style={userInfo}>
          <div style={username}>
            {session.user.username}
          </div>

          <button
            onClick={() => signOut()}
            style={logoutButton}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  /* 🔥 Logged out */
  return (
    <button
      onClick={() => signIn("discord")}
      style={loginButton}
    >
      Login with Discord
    </button>
  );
}

/* 🔥 STYLES */

const loginButton = {
  padding: "12px 20px",
  borderRadius: "14px",
  border: "none",
  background:
    "linear-gradient(135deg, #5865F2 0%, #7289DA 100%)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "15px",
};

const loadingButton = {
  padding: "12px 20px",
  borderRadius: "14px",
  border: "none",
  background: "#222",
  color: "#fff",
  fontWeight: 700,
};

const userWrap = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatarStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  border: "2px solid rgba(255,255,255,0.15)",
};

const userInfo = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
};

const username = {
  fontWeight: 700,
  color: "#fff",
};

const logoutButton = {
  border: "none",
  background: "transparent",
  color: "#ff7a00",
  cursor: "pointer",
  padding: 0,
  fontSize: "0.85rem",
  textAlign: "left" as const,
};