"use client";

import { useState } from "react";

import { Menu, X } from "lucide-react";

import { usePathname } from "next/navigation";

import LoginButton from "@/components/LoginButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const handleNavClick = () => setOpen(false);

  return (
    <header style={header}>
      <div style={navWrapper}>
        <a href="/" style={logo}>
          TRIGGA5TREY
        </a>

        {/* 🔥 DESKTOP NAV */}
        <div style={desktopRight}>
          <nav className="desktop-nav">
            <NavLink
              href="/"
              label="Home"
              active={pathname === "/"}
            />

            <NavLink
              href="/socials"
              label="Socials"
              active={pathname === "/socials"}
            />

            <NavLink
              href="/shop"
              label="Shop"
              active={pathname === "/shop"}
            />

            <NavLink
              href="/admin"
              label="Admin"
              active={pathname === "/admin"}
            />
          </nav>

          {/* 🔥 DISCORD LOGIN */}
          <div className="desktop-login">
            <LoginButton />
          </div>
        </div>

        {/* 🔥 MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          style={mobileButton}
          className="mobile-menu-btn"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🔥 MOBILE MENU */}
      {open && (
        <div style={mobileMenu}>
          <MobileLink
            href="/"
            label="Home"
            onClick={handleNavClick}
          />

          <MobileLink
            href="/socials"
            label="Socials"
            onClick={handleNavClick}
          />

          <MobileLink
            href="/shop"
            label="Shop"
            onClick={handleNavClick}
          />

          <MobileLink
            href="/admin"
            label="Admin"
            onClick={handleNavClick}
          />

          {/* 🔥 MOBILE LOGIN */}
          <div style={{ marginTop: "10px" }}>
            <LoginButton />
          </div>
        </div>
      )}

      <style>
        {`
          .desktop-nav {
            display: flex;
            gap: 28px;
            align-items: center;
          }

          .desktop-login {
            display: flex;
            align-items: center;
          }

          .mobile-menu-btn {
            display: none;
          }

          @media (max-width: 768px) {

            .desktop-nav {
              display: none;
            }

            .desktop-login {
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

/* 🔥 NAV LINK */

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      style={{
        color: active ? "#fff" : "#8d8d8d",
        textDecoration: "none",
        fontWeight: active ? 700 : 500,
        transition: "0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = active
          ? "#fff"
          : "#8d8d8d";
      }}
    >
      {label}
    </a>
  );
}

/* 🔥 MOBILE LINK */

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        color: "#fff",
        textDecoration: "none",
        fontSize: "1.1rem",
        fontWeight: 600,
      }}
    >
      {label}
    </a>
  );
}

/* 🔥 STYLES */

const header = {
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(18px)",
  borderBottom:
    "1px solid rgba(255,255,255,0.06)",
};

const navWrapper = {
  maxWidth: "1250px",
  margin: "0 auto",
  padding: "18px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const desktopRight = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
};

const logo = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
  letterSpacing: "3px",
  fontSize: "1rem",
};

const mobileButton = {
  background: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};

const mobileMenu = {
  background: "rgba(0,0,0,0.96)",
  borderTop:
    "1px solid rgba(255,255,255,0.08)",
  padding: "25px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "18px",
};