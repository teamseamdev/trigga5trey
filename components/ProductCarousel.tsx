"use client";

import { useState, useEffect, useRef } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { CSSProperties } from "react";

export default function ProductCarousel() {
  const items = products.filter((p) => p.featured);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  const startX = useRef(0);

  const current = items[index];

  /* 🔥 AUTO ROTATE (stops after interaction) */
  useEffect(() => {
    if (hasInteracted) return;

    const interval = setInterval(() => {
      setDirection("next");
      setIndex((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, hasInteracted]);

  /* 🔥 PARALLAX */
  const handleMove = (e: any) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    setMouse({ x, y });
  };

  /* 🔥 TOUCH / SWIPE */
  const onTouchStart = (e: any) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: any) => {
    const diff = startX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      setHasInteracted(true);

      if (diff > 0) next();
      else prev();
    }
  };

  const next = () => {
    setHasInteracted(true);
    setDirection("next");
    setIndex((prev) =>
      prev === items.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setHasInteracted(true);
    setDirection("prev");
    setIndex((prev) =>
      prev === 0 ? items.length - 1 : prev - 1
    );
  };

  if (!current) return null;

  return (
    <section
      style={section}
      onMouseMove={handleMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 🔥 GLOW */}
      <div
        style={{
          ...glow,
          background: `radial-gradient(circle, ${
            current.glow || "#ff7a00"
          } 0%, transparent 65%)`,
          transform: `translate(${mouse.x}px, ${mouse.y}px) scale(1.3)`,
        }}
      />

      {/* 🔥 PRODUCT */}
      <div
        key={current.id}
        style={{
          ...productWrap,
          transform: `translate(${mouse.x * 0.4}px, ${
            mouse.y * 0.4
          }px)`,
          animation:
            direction === "next"
              ? "slideRight 0.5s ease"
              : "slideLeft 0.5s ease",
        }}
      >
        <ProductCard product={current} />
      </div>

      {/* 🔥 ARROWS (FIXED TOUCH ISSUE) */}
      <button
        onClick={prev}
        onTouchStart={(e) => e.stopPropagation()}
        style={arrowLeft}
      >
        ‹
      </button>

      <button
        onClick={next}
        onTouchStart={(e) => e.stopPropagation()}
        style={arrowRight}
      >
        ›
      </button>

      {/* 🔥 ANIMATIONS */}
      <style>
        {`
          @keyframes slideRight {
            0% { opacity: 0; transform: translateX(60px) scale(0.95); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }

          @keyframes slideLeft {
            0% { opacity: 0; transform: translateX(-60px) scale(0.95); }
            100% { opacity: 1; transform: translateX(0) scale(1); }
          }
        `}
      </style>
    </section>
  );
}

/* 🔥 STYLES */

const section: CSSProperties = {
  position: "relative",
  height: "520px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  touchAction: "pan-y",
  WebkitOverflowScrolling: "touch",
};

const glow: CSSProperties = {
  position: "absolute",
  width: "120%",
  height: "120%",
  filter: "blur(120px)",
  opacity: 0.35,
  borderRadius: "50%",
  pointerEvents: "none",
  transition: "all 0.6s ease",
};

const productWrap: CSSProperties = {
  zIndex: 2,
  transition: "transform 0.2s ease",
};

const arrowBase: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  cursor: "pointer",
  zIndex: 10,
};

const arrowLeft: CSSProperties = {
  ...arrowBase,
  left: "20px",
};

const arrowRight: CSSProperties = {
  ...arrowBase,
  right: "20px",
};