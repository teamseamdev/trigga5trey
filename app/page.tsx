export const dynamic = "force-dynamic";

import { isTwitchLive } from "@/lib/twitch";
import TwitchPlayer from "@/components/TwitchPlayer";
import { CSSProperties } from "react";
import PushNotifications from "@/components/PushNotifications"; // ✅ ONLY THIS

const FORCE_LIVE = false;

export default async function Home() {
  const isLive = FORCE_LIVE || (await isTwitchLive("trigga5trey"));

  return (
    <main style={main}>
      {isLive ? <LiveView /> : <OfflineHero />}
    </main>
  );
}

/* 🔴 LIVE VIEW */
function LiveView() {
  return (
    <section style={liveSection}>
      <TwitchPlayer channel="trigga5trey" />

      <div style={overlay} />
      <div style={liveBadge}>LIVE</div>

      <div style={buttons}>
        <a href="/shop" style={primaryBtn}>
          Shop Merch
        </a>

        <a
          href="https://discord.gg/MVzzrFtUcR"
          target="_blank"
          rel="noopener noreferrer"
          style={secondaryBtn}
        >
          Join Discord
        </a>
      </div>
    </section>
  );
}

/* ⚫ OFFLINE HERO */
function OfflineHero() {
  return (
    <section style={centered}>
      <div>
        <h1 style={headline}>
          WELCOME TO{" "}
          <span style={{ color: "#ff7a00" }}>THE FIVE</span>
        </h1>

        <p style={subText}>
          Stream. Culture. Community.
        </p>

        <div style={heroButtons}>
          <a href="/shop" style={primaryBtn}>
            Shop Collection
          </a>

          <a
            href="https://discord.gg/MVzzrFtUcR"
            target="_blank"
            rel="noopener noreferrer"
            style={secondaryBtn}
          >
            Join Discord
          </a>
        </div>

        {/* 🔥 REAL PUSH BUTTON (FIXED) */}
        <div style={{ marginTop: "20px" }}>
          <PushNotifications />
        </div>
      </div>
    </section>
  );
}

/* 🔥 STYLES */

const main: CSSProperties = {
  color: "#fff",
  minHeight: "100vh",
};

const liveSection: CSSProperties = {
  height: "100vh",
  position: "relative",
};

const centered: CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "0 20px",
};

const headline: CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 3.5rem)",
  marginBottom: "10px",
};

const subText: CSSProperties = {
  opacity: 0.8,
  marginBottom: "25px",
};

const overlay: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
};

const liveBadge: CSSProperties = {
  position: "absolute",
  top: 20,
  left: 20,
  background: "#ff2d2d",
  padding: "6px 10px",
  borderRadius: 6,
  fontWeight: 700,
  letterSpacing: "1px",
};

const buttons: CSSProperties = {
  position: "absolute",
  bottom: 40,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 15,
  flexWrap: "wrap",
  justifyContent: "center",
};

const heroButtons: CSSProperties = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const primaryBtn: CSSProperties = {
  padding: "12px 24px",
  background: "#ff7a00",
  color: "#000",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryBtn: CSSProperties = {
  padding: "12px 24px",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: 8,
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
};