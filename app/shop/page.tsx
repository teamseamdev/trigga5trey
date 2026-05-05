import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  return (
    <main
      style={{
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <section
        style={{
          padding: "80px 20px 40px",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          SHOP
        </h1>

        <p style={{ opacity: 0.6 }}>
          Official TRIGGA5TREY Merch
        </p>
      </section>

      {/* 🔥 PRODUCT GRID (glass container) */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "30px",
            padding: "30px",
            borderRadius: "16px",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <a
          href="https://trigga5trey-shop.fourthwall.com"
          target="_blank"
          rel="noopener noreferrer"
          style={ctaBtn}
        >
          View Full Store →
        </a>
      </div>
    </main>
  );
}

/* CTA BUTTON */
const ctaBtn = {
  padding: "14px 30px",
  background: "#ff7a00",
  color: "#000",
  borderRadius: "8px",
  fontWeight: 700,
  textDecoration: "none",
  transition: "0.25s ease",
};