"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
          padding: "15px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO */}
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

        {/* DESKTOP NAV */}
        <nav className="desktop-nav">
          <a href="/" style={link(pathname === "/")}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
  onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
  >
            Home
          </a>
          <a href="/socials" style={link(pathname === "/socials")}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
  onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}>
            Socials
          </a>
          <a href="/shop" style={link(pathname === "/shop")}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
  onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}>
            Shop
          </a>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
          className="mobile-menu-btn"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div
          style={{
            background: "#000",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <a href="/" style={mobileLink}>
            Home
          </a>
          <a href="/socials" style={mobileLink}>
            Socials
          </a>
          <a href="/shop" style={mobileLink}>
            Shop
          </a>
        </div>
      )}

      {/* RESPONSIVE STYLES */}
      <style>
        {`
          .desktop-nav {
            display: flex;
            gap: 25px;
          }

          .mobile-menu-btn {
            display: none;
          }

          @media (max-width: 768px) {
            .desktop-nav {
              display: none;
            }

            .mobile-menu-btn {
              display: block;
            }
          }
        `}
      </style>
    </header>
  );
}

/* STYLES */
const link = (active: boolean) => ({
  color: active ? "#fff" : "#aaa",
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "0.2s",
});

const mobileLink = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "1.1rem",
};