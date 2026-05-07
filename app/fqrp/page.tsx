"use client";

import { useEffect, useState } from "react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* 🔥 ROLE LABELS */

const ROLE_LABELS: Record<
  string,
  string
> = {
  citizens: "Citizens",

  businesses:
    "Business Owners",

  gangMembers:
    "Gang Members",

  leo: "LEO",

  safr: "Fire/EMS",

  doj: "Lawyers",

  mech: "Mechanics",

  staff: "Staff",
};

const ROLE_ORDER = [
  "citizens",

  "businesses",

  "gangMembers",

  "leo",

  "safr",

  "doj",

  "mech",

  "staff",
];

export default function FQRPPage() {
  const [stats, setStats] =
    useState<Record<string, number>>(
      {}
    );

  /* 🔥 LIVE FIRESTORE STATS */

  useEffect(() => {
    const ref = doc(
      db,
      "communityStats",
      "live"
    );

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();

          delete data.updatedAt;

          setStats(
            data as Record<
              string,
              number
            >
          );
        }
      }
    );

    return () => unsub();
  }, []);

  return (
    <>
      <style>
        {mobileStatsStyles}
      </style>

      <main
        style={{
          color: "#fff",
          minHeight: "100vh",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        {/* 🔥 HERO */}

        <section style={heroSection}>
          <div style={heroOverlay} />

          <div style={heroContent}>
            <div style={tag}>
              FIFTH QUARTER RP
            </div>

            <h1 style={headline}>
              THE CITY NEVER
              SLEEPS
            </h1>

            <p style={subtext}>
              The official
              roleplay universe of
              THE FIVE.
            </p>

            <div style={heroButtons}>
              <a
                href="https://discord.gg/MVzzrFtUcR"
                target="_blank"
                rel="noopener noreferrer"
                style={primaryBtn}
              >
                Join The City
              </a>

              <a
                href="#features"
                style={
                  secondaryBtn
                }
              >
                Explore
              </a>
            </div>
          </div>
        </section>

        {/* 🔥 STATS HEADER */}

        <div style={statsHeader}>
          <div style={statsTag}>
            LIVE CITY DATA
          </div>

          <h2 style={statsTitle}>
            City Stats
          </h2>

          <p style={statsSubtitle}>
            Realtime community
            and faction activity
            across Fifth Quarter
            RP.
          </p>
        </div>

        {/* 🔥 LIVE STATS */}

        <section
          style={statsSection}
          className="stats-scroll"
        >
          {ROLE_ORDER.map(
            (key) => (
              <StatCard
                key={key}
                value={String(
                  stats[key] || 0
                )}
                label={
                  ROLE_LABELS[
                    key
                  ] || key
                }
              />
            )
          )}
        </section>

        {/* 🔥 FEATURE GRID */}

        <section
          id="features"
          style={featuresSection}
        >
          <FeatureCard
            title="🏙️ Immersive City"
            description="A living roleplay universe driven by community stories, factions, and economy."
          />

          <FeatureCard
            title="💰 Player Economy"
            description="Run businesses, build empires, and shape the city's underground."
          />

          <FeatureCard
            title="🚔 Real Departments"
            description="Join PD, EMS, DOJ, or build your own criminal empire."
          />

          <FeatureCard
            title="🎮 Built For THE FIVE"
            description="Integrated directly into the TRIGGA5TREY ecosystem."
          />
        </section>

        {/* 🔥 FUTURE LIVE MODULE */}

        <section style={livePanel}>
          <div style={liveGlow} />

          <div
            style={{
              position:
                "relative",
            }}
          >
            <div style={panelTag}>
              LIVE CITY STATUS
            </div>

            <h2
              style={
                panelHeadline
              }
            >
              Realtime systems
              coming soon
            </h2>

            <p style={panelText}>
              Live player
              counts, faction
              activity,
              dispatch feeds,
              economy tracking,
              territory
              control, and
              citywide events
              will appear here.
            </p>
          </div>
        </section>

        {/* 🔥 CTA */}

        <section style={ctaSection}>
          <h2 style={ctaHeadline}>
            ENTER THE FIFTH
            QUARTER
          </h2>

          <p style={ctaText}>
            Join the
            community. Build
            your legacy.
          </p>

          <a
            href="https://discord.gg/MVzzrFtUcR"
            target="_blank"
            rel="noopener noreferrer"
            style={ctaBtn}
          >
            Join Discord →
          </a>
        </section>
      </main>
    </>
  );
}

/* 🔥 COMPONENTS */

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div style={statCard}>
      <div style={statValue}>
        {value}
      </div>

      <div style={statLabel}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={featureCard}>
      <h3 style={featureTitle}>
        {title}
      </h3>

      <p style={featureText}>
        {description}
      </p>
    </div>
  );
}

/* 🔥 MOBILE CAROUSEL */

const mobileStatsStyles = `
@media (max-width: 768px) {

  .stats-scroll {
    display: flex !important;

    overflow-x: auto;

    overflow-y: hidden;

    scroll-snap-type: x mandatory;

    -webkit-overflow-scrolling: touch;

    gap: 16px;

    padding-bottom: 10px;
  }

  .stats-scroll::-webkit-scrollbar {
    display: none;
  }

  .stats-scroll > div {
    min-width: 240px;

    scroll-snap-align: center;

    flex-shrink: 0;
  }
}
`;

/* 🔥 STYLES */

const heroSection = {
  minHeight: "88vh",

  position: "relative" as const,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  textAlign: "center" as const,

  padding: "0 20px",
};

const heroOverlay = {
  position: "absolute" as const,

  inset: 0,

  background:
    "radial-gradient(circle at top, rgba(255,122,0,0.18), rgba(0,0,0,0.78) 60%)",
};

const heroContent = {
  position: "relative" as const,

  zIndex: 2,

  maxWidth: "900px",
};

const tag = {
  display: "inline-block",

  padding: "10px 18px",

  borderRadius: "999px",

  background:
    "rgba(255,122,0,0.12)",

  border:
    "1px solid rgba(255,122,0,0.3)",

  color: "#ff7a00",

  fontWeight: 700,

  letterSpacing: "2px",

  marginBottom: "25px",

  fontSize: "0.85rem",
};

const headline = {
  fontSize:
    "clamp(3rem, 8vw, 6rem)",

  fontWeight: 900,

  lineHeight: 1,

  marginBottom: "22px",
};

const subtext = {
  opacity: 0.75,

  fontSize: "1.15rem",

  lineHeight: 1.6,

  maxWidth: "700px",

  margin: "0 auto 35px",
};

const heroButtons = {
  display: "flex",

  gap: "18px",

  justifyContent: "center",

  flexWrap: "wrap" as const,
};

const primaryBtn = {
  padding: "16px 34px",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg, #ff7a00 0%, #ff9d2f 100%)",

  color: "#000",

  textDecoration: "none",

  fontWeight: 800,

  boxShadow:
    "0 0 35px rgba(255,122,0,0.35)",
};

const secondaryBtn = {
  padding: "16px 34px",

  borderRadius: "14px",

  border:
    "1px solid rgba(255,255,255,0.12)",

  color: "#fff",

  textDecoration: "none",

  fontWeight: 700,

  backdropFilter:
    "blur(10px)",
};

const statsHeader = {
  textAlign: "center" as const,

  padding:
    "20px 20px 10px",

  maxWidth: "800px",

  margin: "0 auto",
};

const statsTag = {
  color: "#ff7a00",

  fontWeight: 800,

  letterSpacing: "2px",

  marginBottom: "12px",

  fontSize: "0.8rem",
};

const statsTitle = {
  fontSize:
    "clamp(2rem, 5vw, 3.5rem)",

  marginBottom: "12px",

  fontWeight: 900,
};

const statsSubtitle = {
  opacity: 0.7,

  lineHeight: 1.6,

  maxWidth: "650px",

  margin: "0 auto",
};

const statsSection = {
  maxWidth: "1200px",

  margin: "0 auto",

  padding: "40px 20px",

  display: "grid",

  gap: "20px",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
};

const statCard = {
  minWidth: "220px",

  padding: "28px",

  borderRadius: "24px",

  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",

  border:
    "1px solid rgba(255,255,255,0.08)",

  backdropFilter:
    "blur(16px)",

  textAlign: "center" as const,

  boxShadow:
    "0 10px 40px rgba(0,0,0,0.22)",
};

const statValue = {
  fontSize: "2.7rem",

  fontWeight: 900,

  marginBottom: "8px",
};

const statLabel = {
  opacity: 0.7,
};

const featuresSection = {
  maxWidth: "1200px",

  margin: "0 auto",

  padding: "40px 20px 80px",

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",

  gap: "22px",
};

const featureCard = {
  padding: "28px",

  borderRadius: "24px",

  background:
    "rgba(255,255,255,0.03)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  backdropFilter:
    "blur(14px)",
};

const featureTitle = {
  marginBottom: "14px",

  fontSize: "1.2rem",
};

const featureText = {
  opacity: 0.7,

  lineHeight: 1.6,
};

const livePanel = {
  maxWidth: "1200px",

  margin: "0 auto",

  padding: "60px 30px",

  borderRadius: "30px",

  overflow: "hidden",

  position: "relative" as const,

  background:
    "rgba(255,255,255,0.03)",

  border:
    "1px solid rgba(255,255,255,0.08)",
};

const liveGlow = {
  position: "absolute" as const,

  width: "500px",

  height: "500px",

  background:
    "radial-gradient(circle, rgba(255,122,0,0.22), transparent 70%)",

  top: "-200px",

  right: "-120px",
};

const panelTag = {
  color: "#ff7a00",

  fontWeight: 800,

  letterSpacing: "2px",

  marginBottom: "14px",
};

const panelHeadline = {
  fontSize:
    "clamp(2rem, 5vw, 3.5rem)",

  marginBottom: "18px",
};

const panelText = {
  opacity: 0.75,

  maxWidth: "750px",

  lineHeight: 1.7,
};

const ctaSection = {
  textAlign: "center" as const,

  padding: "120px 20px",
};

const ctaHeadline = {
  fontSize:
    "clamp(2.5rem, 6vw, 4rem)",

  marginBottom: "14px",
};

const ctaText = {
  opacity: 0.7,

  marginBottom: "35px",
};

const ctaBtn = {
  padding: "16px 36px",

  borderRadius: "14px",

  background: "#ff7a00",

  color: "#000",

  textDecoration: "none",

  fontWeight: 800,

  display: "inline-block",
};