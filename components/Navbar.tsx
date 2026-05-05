"use client";

export default function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO / NAME */}
        <a
          href="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          TRIGGA5TREY
        </a>

        {/* NAV LINKS */}
        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="/" style={linkStyle}>
            Home
          </a>

          <a href="/socials" style={linkStyle}>
            Socials
          </a>

          <a href="/shop" style={linkStyle}>
  Shop
</a>
        </nav>
      </div>
    </header>
  );
}

const linkStyle = {
  color: "#aaa",
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "0.2s ease",
};