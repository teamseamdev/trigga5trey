import { isTwitchLive } from "@/lib/twitch";
import TwitchPlayer from "@/components/TwitchPlayer";

const FORCE_LIVE = false;

export default async function Home() {
  const isLive = FORCE_LIVE || (await isTwitchLive("trigga5trey"));

  return (
    <main
      style={{
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {isLive ? <LiveView /> : <OfflineHero />}
    </main>
  );
}

function LiveView() {
  return (
    <section style={{ height: "100vh", position: "relative" }}>
      <TwitchPlayer channel="trigga5trey" />

      <div style={overlay} />

      <div style={liveBadge}>LIVE</div>

      <div style={buttons}>
        <a href="/shop" style={primaryBtn}>Shop Merch</a>
        <a href="https://discord.gg/MVzzrFtUcR" target="_blank" style={secondaryBtn}>
          Join Discord
        </a>
      </div>
    </section>
  );
}

function OfflineHero() {
  return (
    <section style={centered}>
      <div>
        <h1>
          WELCOME TO <span style={{ color: "#ff7a00" }}>THE FIVE</span>
        </h1>

        <p style={{ opacity: 0.8 }}>Stream. Culture. Community.</p>

        <div style={{ marginTop: 20 }}>
          <a href="/shop" style={primaryBtn}>Shop Collection</a>
        </div>
      </div>
    </section>
  );
}

/* styles */
const centered = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(0,0,0,0.3)",
};

const liveBadge = {
  position: "absolute" as const,
  top: 20,
  left: 20,
  background: "#ff2d2d",
  padding: "6px 10px",
  borderRadius: 6,
  fontWeight: 700,
};

const buttons = {
  position: "absolute" as const,
  bottom: 40,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 15,
};

const primaryBtn = {
  padding: "12px 24px",
  background: "#ff7a00",
  color: "#000",
  borderRadius: 8,
  textDecoration: "none",
};

const secondaryBtn = {
  padding: "12px 24px",
  border: "1px solid #fff",
  borderRadius: 8,
  color: "#fff",
  textDecoration: "none",
};