import {
  FaTwitch,
  FaDiscord,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import SocialButton from "@/components/SocialButton";
import { isTwitchLive } from "@/lib/twitch";

export default async function Socials() {
  const isLive = await isTwitchLive("trigga5trey");

  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <section
        style={{
          padding: "80px 40px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          SOCIALS
        </h1>

        <p style={{ opacity: 0.6 }}>
          Stay connected with TRIGGA5TREY
        </p>
      </section>

      {/* BUTTON ROW */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        >
          <SocialButton
            href="https://www.twitch.tv/trigga5trey"
            label="Twitch"
            color="#9146FF"
            glowColor="rgba(145,70,255,0.6)"
            icon={<FaTwitch size={18} />}
            isLive={isLive}
          />

          <SocialButton
            href="https://kick.com/trigga5trey"
            label="Kick"
            color="#53fc18"
            glowColor="rgba(83,252,24,0.6)"
            icon={<FaPlay size={18} />}
            darkText
          />

          <SocialButton
            href="https://discord.gg/MVzzrFtUcR"
            label="Discord"
            color="#5865F2"
            glowColor="rgba(88,101,242,0.6)"
            icon={<FaDiscord size={18} />}
          />

          {/* 🔥 YouTube */}
          <SocialButton
            href="https://www.youtube.com/@TriggaVTrey"
            label="YouTube"
            color="#FF0000"
            glowColor="rgba(255,0,0,0.6)"
            icon={<FaYoutube size={18} />}
          />

          {/* Instagram */}
          <SocialButton
            href="https://instagram.com/YOUR_USERNAME"
            label="Instagram"
            color="linear-gradient(45deg, #ff0069, #ff7a00)"
            glowColor="rgba(255,0,105,0.6)"
            icon={<FaInstagram size={18} />}
          />

          {/* TikTok */}
          <SocialButton
            href="https://tiktok.com/@YOUR_USERNAME"
            label="TikTok"
            color="#000"
            glowColor="rgba(255,255,255,0.2)"
            border
            icon={<FaTiktok size={18} />}
          />
        </div>
      </section>

      {/* FEED */}
      <section style={{ position: "relative" }}>
        <div style={fadeTop} />

        <iframe
          src="https://www.juicer.io/api/feeds/trey-lance/iframe"
          width="100%"
          height="2200"
          scrolling="no"
          style={{ border: "none", display: "block" }}
          title="TRIGGA5TREY Social Feed"
        />

        <div style={fadeBottom} />
      </section>
    </main>
  );
}

/* FADE */
const fadeTop = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  height: "120px",
  background:
    "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
  zIndex: 2,
  pointerEvents: "none" as const,
};

const fadeBottom = {
  position: "absolute" as const,
  bottom: 0,
  left: 0,
  right: 0,
  height: "120px",
  background:
    "linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
  zIndex: 2,
  pointerEvents: "none" as const,
};