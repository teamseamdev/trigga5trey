import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
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
      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem" }}>SHOP</h1>
        <p style={{ opacity: 0.6 }}>Official TRIGGA5TREY Merch</p>
      </section>

      {/* PRODUCT GRID */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "30px",
        }}
      >
        {products.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </section>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "60px" }}>
        <a href="https://trigga5trey-shop.fourthwall.com" style={ctaBtn}>
          View Full Store →
        </a>
      </div>
    </main>
  );
}

const ctaBtn = {
  padding: "14px 30px",
  background: "#ff7a00",
  color: "#000",
  borderRadius: "8px",
  fontWeight: 700,
  textDecoration: "none",
};