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
      <img src={product.image} alt={product.name} style={image} />

      <div style={info}>
        <h3>{product.name}</h3>
        <p>${product.price.toFixed(2)}</p>
      </div>
    </a>
  );
}

const card: CSSProperties = {
  textAlign: "center",
  textDecoration: "none",
  color: "#fff",
  background: "transparent", // 🔥 THIS REMOVES THE BOX
};

const image: CSSProperties = {
  width: "320px",
  maxWidth: "90%",
  margin: "0 auto",
  display: "block",
};

const info: CSSProperties = {
  marginTop: "10px",
};