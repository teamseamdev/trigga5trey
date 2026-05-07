export const dynamic = "force-dynamic";

import { isTwitchLive } from "@/lib/twitch";
import TwitchPlayer from "@/components/TwitchPlayer";
import PushNotifications from "@/components/PushNotifications";
import { CSSProperties } from "react";

const FORCE_LIVE = false;

export default async function Home() {
  const isLive =
    FORCE_LIVE ||
    (await isTwitchLive("trigga5trey"));

  return (
    <main style={main}>
      <div style={backgroundAccent} />

      {/* 🔴 LIVE STREAM SECTION */}
      {isLive && <LiveStreamSection />}

      {/* ⚫ NORMAL HERO */}
      <OfflineHero />
    </main>
  );
}

/* 🔴 LIVE STREAM SECTION */

function LiveStreamSection() {
  return (
    <section style={liveWrapper}>
      <div style={liveHeader}>
        <div style={liveBadge}>
          <span style={pulseDot} />
          LIVE NOW
        </div>

        <h2 style={liveTitle}>
          TRIGGA5TREY IS LIVE
        </h2>

        <p style={liveDescription}>
          Tap into the stream live.
        </p>

        <div style={liveButtons}>
          <a
            href="/shop"
            style={primaryBtn}
          >
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
      </div>

      <div style={playerContainer}>
  <div style={playerInner}>
    <TwitchPlayer channel="trigga5trey" />
  </div>
</div>
    </section>
  );
}

/* ⚫ HERO */

function OfflineHero() {
  return (
    <section style={centered}>
      <div style={heroContent}>
        <div style={miniBadge}>
          TRIGGA5TREY
        </div>

        <h1 style={headline}>
          WELCOME TO{" "}
          <span style={gradientText}>
            THE FIVE
          </span>
        </h1>

        <p style={subText}>
          Stream. Culture. Community.
        </p>

        <div style={heroButtons}>
          <a
            href="/shop"
            style={primaryBtn}
          >
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

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <PushNotifications />
        </div>
      </div>
    </section>
  );
}

/* 🔥 STYLES */

const main: CSSProperties = {
  minHeight: "100vh",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(to bottom, #0a0a0a 0%, #000 100%)",
};

const backgroundAccent: CSSProperties =
  {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,0.72),
        rgba(0,0,0,0.88)
      ),
      url('/hero.jpg')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 0,
  };

/* 🔴 LIVE */

const liveWrapper: CSSProperties = {
  position: "relative",
  zIndex: 2,

  width: "100%",
  maxWidth: "1600px",

  margin: "0 auto",

  padding:
    "120px 20px 60px",
};

const liveHeader: CSSProperties = {
  textAlign: "center",

  marginBottom: "40px",
};

const liveBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",

  background:
    "rgba(255,45,45,0.15)",

  border:
    "1px solid rgba(255,45,45,0.35)",

  padding: "10px 14px",

  borderRadius: "999px",

  fontWeight: 700,

  letterSpacing: "1px",

  marginBottom: "20px",
};

const pulseDot: CSSProperties = {
  width: "10px",
  height: "10px",
  background: "#ff2d2d",
  borderRadius: "999px",
  boxShadow:
    "0 0 14px #ff2d2d",
};

const liveTitle: CSSProperties = {
  fontSize:
    "clamp(2.5rem, 6vw, 5rem)",

  fontWeight: 900,

  marginBottom: "14px",
};

const liveDescription: CSSProperties =
  {
    opacity: 0.75,

    fontSize: "1.1rem",

    marginBottom: "28px",
  };

const liveButtons: CSSProperties = {
  display: "flex",

  justifyContent: "center",

  gap: "16px",

  flexWrap: "wrap",
};

const playerContainer: CSSProperties = {
  width: "100%",
  maxWidth: "1100px",

  margin: "0 auto",

  aspectRatio: "16 / 9",

  borderRadius: "28px",

  overflow: "hidden",

  border:
    "1px solid rgba(255,255,255,0.08)",

  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45)",

  background: "#000",
};

/* ⚫ HERO */

const centered: CSSProperties = {
  minHeight: "100vh",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  padding: "40px 20px",

  position: "relative",

  zIndex: 2,
};

const heroContent: CSSProperties = {
  width: "100%",

  maxWidth: "760px",

  textAlign: "center",

  position: "relative",

  zIndex: 2,
};

const miniBadge: CSSProperties = {
  display: "inline-block",

  marginBottom: "18px",

  padding: "8px 14px",

  borderRadius: "999px",

  background:
    "rgba(255,122,0,0.08)",

  border:
    "1px solid rgba(255,122,0,0.18)",

  color: "#ff7a00",

  fontSize: "0.85rem",

  letterSpacing: "2px",

  fontWeight: 700,
};

const headline: CSSProperties = {
  fontSize:
    "clamp(3rem, 8vw, 6rem)",

  lineHeight: 0.95,

  marginBottom: "20px",

  fontWeight: 900,
};

const gradientText: CSSProperties = {
  background:
    "linear-gradient(90deg, #ff7a00 0%, #ffb36b 100%)",

  WebkitBackgroundClip: "text",

  WebkitTextFillColor:
    "transparent",
};

const subText: CSSProperties = {
  fontSize: "1.15rem",

  opacity: 0.72,

  marginBottom: "35px",
};

const heroButtons: CSSProperties = {
  display: "flex",

  gap: "15px",

  justifyContent: "center",

  flexWrap: "wrap",
};

const primaryBtn: CSSProperties = {
  padding: "14px 28px",

  background:
    "linear-gradient(135deg, #ff7a00 0%, #ff9a2f 100%)",

  color: "#000",

  borderRadius: "14px",

  textDecoration: "none",

  fontWeight: 800,

  boxShadow:
    "0 8px 24px rgba(255,122,0,0.28)",
};

const secondaryBtn: CSSProperties = {
  padding: "14px 28px",

  border:
    "1px solid rgba(255,255,255,0.12)",

  background:
    "rgba(255,255,255,0.03)",

  borderRadius: "14px",

  color: "#fff",

  textDecoration: "none",

  fontWeight: 700,
};

const playerInner: CSSProperties = {
  width: "100%",
  height: "100%",
};