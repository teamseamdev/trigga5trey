import { isTwitchLive } from "@/lib/twitch";
import TwitchPlayer from "@/components/TwitchPlayer";

const FORCE_LIVE = false; // 🔥 set true for testing

export default async function Home() {
  const isLive = FORCE_LIVE || (await isTwitchLive("trigga5trey"));

  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {isLive ? <LiveView /> : <OfflineHero />}
    </main>
  );
}

/* 🔴 LIVE VIEW */
function LiveView() {
  return (
    <section
      style={{
        height: "100vh",
        position: "relative",
      }}
    >
      {/* ✅ FIXED TWITCH PLAYER */}
      <TwitchPlayer channel="trigga5trey" />

      {/* 🔴 LIVE BADGE */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "#ff2d2d",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        LIVE
      </div>

      {/* BUTTONS */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "15px",
        }}
      >
        <a href="/shop" style={primaryBtn}>
          Shop Merch
        </a>

        <a
          href="https://discord.gg/MVzzrFtUcR"
          target="_blank"
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
    <section
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "3rem" }}>
          WELCOME TO <span style={{ color: "#ff7a00" }}>THE FIVE</span>
        </h1>

        <p style={{ opacity: 0.7 }}>Stream. Culture. Community.</p>

        <div style={{ marginTop: "20px" }}>
          <a href="/shop" style={primaryBtn}>
            Shop Collection
          </a>
        </div>
      </div>
    </section>
  );
}

/* BUTTONS */
const primaryBtn = {
  padding: "12px 24px",
  background: "#ff7a00",
  color: "#000",
  borderRadius: "8px",
  fontWeight: 700,
  textDecoration: "none",
};

const secondaryBtn = {
  padding: "12px 24px",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "8px",
  color: "#fff",
  textDecoration: "none",
};