"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = () => setOpen(false);

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
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink href="/socials" label="Socials" active={pathname === "/socials"} />
          <NavLink href="/shop" label="Shop" active={pathname === "/shop"} />

          {/* 🔥 ADMIN LINK */}
          <NavLink href="/admin" label="Admin" active={pathname === "/admin"} />
        </nav>

        {/* MOBILE BUTTON */}
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

      {/* MOBILE MENU */}
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
          <MobileLink href="/" label="Home" onClick={handleNavClick} />
          <MobileLink href="/socials" label="Socials" onClick={handleNavClick} />
          <MobileLink href="/shop" label="Shop" onClick={handleNavClick} />

          {/* 🔥 ADMIN LINK */}
          <MobileLink href="/admin" label="Admin" onClick={handleNavClick} />
        </div>
      )}

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

/* 🔥 COMPONENTS */

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
        color: active ? "#fff" : "#aaa",
        textDecoration: "none",
        fontSize: "0.9rem",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = active ? "#fff" : "#aaa")
      }
    >
      {label}
    </a>
  );
}

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
      }}
    >
      {label}
    </a>
  );
}