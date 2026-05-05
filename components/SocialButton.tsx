"use client";

export default function SocialButton({
  href,
  label,
  color,
  icon,
  darkText,
  border,
  glowColor,
  isLive,
}: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "14px 18px",
        borderRadius: "10px",
        background: color,
        color: darkText ? "#000" : "#fff",
        border: border ? "1px solid #333" : "none",
        textDecoration: "none",
        fontWeight: 600,
        transition: "all 0.25s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 0 25px ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* 🔴 LIVE BADGE */}
      {isLive && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: "#ff2d2d",
            color: "#fff",
            fontSize: "10px",
            padding: "4px 6px",
            borderRadius: "6px",
            fontWeight: 700,
            letterSpacing: "1px",
            animation: "pulse 1.5s infinite",
          }}
        >
          LIVE
        </span>
      )}

      {icon}
      {label}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </a>
  );
}