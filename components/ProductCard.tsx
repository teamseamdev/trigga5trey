"use client";

import { CSSProperties } from "react";

export default function ProductCard({ product }: any) {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      style={card}
    >
      {/* IMAGE */}
      <div style={imageWrap}>
        <img src={product.image} alt={product.name} style={image} />
      </div>

      {/* INFO */}
      <div style={info}>
        <h3 style={name}>{product.name}</h3>
        <p style={price}>${product.price.toFixed(2)}</p>
      </div>
    </a>
  );
}

/* 🔥 STYLES */

const card: CSSProperties = {
  borderRadius: "18px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.06)",
  background:
    "linear-gradient(145deg, rgba(30,30,30,0.9), rgba(10,10,10,0.95))",
  backdropFilter: "blur(10px)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const imageWrap: CSSProperties = {
  width: "100%",
  aspectRatio: "1 / 1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.05), transparent)",
};

const image: CSSProperties = {
  maxWidth: "85%",
  maxHeight: "85%",
  objectFit: "contain",
};

const info: CSSProperties = {
  padding: "18px",
  textAlign: "center",
};

const name: CSSProperties = {
  fontSize: "1rem",
  marginBottom: "6px",
};

const price: CSSProperties = {
  opacity: 0.7,
  fontSize: "0.95rem",
};