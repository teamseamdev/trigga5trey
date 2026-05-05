import ProductCarousel from "@/components/ProductCarousel";

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

      {/* 🔥 FEATURED CAROUSEL ONLY */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Featured
        </h2>

        <ProductCarousel />
      </section>

      {/* 🔥 CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <a
          href="https://trigga5trey-shop.fourthwall.com"
          target="_blank"
          rel="noopener noreferrer"
          style={ctaBtn}
        >
          View All Merch →
        </a>
      </div>
    </main>
  );
}

/* BUTTON */
const ctaBtn = {
  padding: "14px 30px",
  background: "#ff7a00",
  color: "#000",
  borderRadius: "8px",
  fontWeight: 700,
  textDecoration: "none",
};