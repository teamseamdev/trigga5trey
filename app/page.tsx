import { isTwitchLive } from "@/lib/twitch";

export default async function Home() {
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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ letterSpacing: "3px", fontWeight: 600 }}>
          TRIGGA5TREY
        </h2>

        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="/" style={navLink}>Home</a>
          <a href="https://yourstore.fourthwall.com" target="_blank" style={navLink}>
            Shop
          </a>
        </nav>
      </header>

      {isLive ? (
        // 🔴 LIVE MODE (CLEAN CINEMATIC PLAYER)
        <section
          style={{
            padding: "60px 40px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                color: "#ff2d2d",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              ● LIVE NOW
            </span>
          </div>

          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <iframe
              src="https://player.twitch.tv/?channel=trigga5trey&parent=localhost"
              height={600}
              width="100%"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </section>
      ) : (
        // 🟢 OFFLINE HERO
        <section
          style={{
            position: "relative",
            height: "85vh",
            display: "flex",
            alignItems: "center",
            padding: "0 60px",
          }}
        >
          {/* BACKGROUND */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519681393784-d120267933ba')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%) contrast(120%)",
            }}
          />

          {/* DARK OVERLAY */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.4))",
            }}
          />

          {/* CONTENT */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              WELCOME TO{" "}
              <span style={{ color: "#ff6a00" }}>THE FIVE</span>
            </h1>

            <p
              style={{
                marginTop: "15px",
                opacity: 0.7,
                fontSize: "1.1rem",
              }}
            >
              Stream. Culture. Community.
            </p>

            <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
              <a
                href="https://trigga5trey-shop.fourthwall.com/"
                target="_blank"
                style={primaryBtn}
              >
                Shop Collection
              </a>

              <a
                href="https://discord.gg/MVzzrFtUcR"
                target="_blank"
                style={secondaryBtn}
              >
                Join Discord
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER / SOCIAL BAR */}
      <section
        style={{
          padding: "40px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        <a href="https://www.twitch.tv/trigga5trey" target="_blank" style={social}>
          Twitch
        </a>

        <a href="https://kick.com/trigga5trey" target="_blank" style={social}>
          Kick
        </a>

        <a href="https://discord.gg/MVzzrFtUcR" target="_blank" style={social}>
          Discord
        </a>
      </section>
    </main>
  );
}

/* STYLES */
const navLink = {
  color: "#aaa",
  textDecoration: "none",
  fontSize: "0.9rem",
};

const primaryBtn = {
  padding: "12px 22px",
  background: "#fff",
  color: "#000",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: 600,
};

const secondaryBtn = {
  padding: "12px 22px",
  border: "1px solid #444",
  borderRadius: "6px",
  color: "#fff",
  textDecoration: "none",
};

const social = {
  color: "#888",
  textDecoration: "none",
  fontSize: "0.9rem",
};