"use client";

export default function ProductCard({ product }: any) {
  return (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        color: "#fff",
      }}
    >
      <div
        style={{
          background: "#0a0a0a",
          padding: "20px",
          borderRadius: "14px",
          transition: "all 0.3s ease",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow =
            "0 0 40px rgba(255,140,0,0.25)";
          e.currentTarget.style.border =
            "1px solid rgba(255,140,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.border =
            "1px solid rgba(255,255,255,0.05)";
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        />

        <h3 style={{ fontSize: "1.1rem" }}>{product.name}</h3>

        <p style={{ opacity: 0.6 }}>{product.price}</p>
      </div>
    </a>
  );
}