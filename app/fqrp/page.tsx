"use client";

import { useEffect, useState } from "react";

import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
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
              The official roleplay
              universe of THE FIVE.
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
                style={secondaryBtn}
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
            Realtime community and
            faction activity across
            Fifth Quarter RP.
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

        {/* 🔥 LIVE POLICE SCANNER */}

        <ScannerFeed />

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

        {/* 🔥 CTA */}

        <section style={ctaSection}>
          <h2 style={ctaHeadline}>
            ENTER THE FIFTH
            QUARTER
          </h2>

          <p style={ctaText}>
            Join the community.
            Build your legacy.
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

/* 🔥 SCANNER */

function ScannerFeed() {
  const [calls, setCalls] =
    useState<any[]>([]);

  useEffect(() => {
    const scannerRef =
      collection(
        db,
        "scannerFeed"
      );

    const q = query(
      scannerRef,
      orderBy(
        "createdAt",
        "desc"
      ),
      limit(6)
    );

    const unsub =
      onSnapshot(
        q,
        (snapshot) => {
          const items =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setCalls(items);
        }
      );

    return () => unsub();
  }, []);

  return (
    <section style={scannerSection}>
      <div style={scannerHeader}>
        <div style={scannerTag}>
          LIVE DISPATCH
        </div>

        <h2 style={scannerTitle}>
          Police Scanner
        </h2>

        <p style={scannerSubtitle}>
          Realtime emergency
          dispatch activity
          across Fifth Quarter
          RP.
        </p>
      </div>

      <div style={scannerGrid} className="scanner-scroll" >
        {calls.map((call) => (
          <div
            key={call.id}
            style={{
              ...scannerCard,

              border:
                call.priority ===
                "high"
                  ? "1px solid rgba(255,0,0,0.45)"
                  : call.priority ===
                    "medium"
                  ? "1px solid rgba(255,122,0,0.35)"
                  : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={scannerTop}>
              <div
                style={{
                  ...priorityDot,

                  background:
                    call.priority ===
                    "high"
                      ? "#ff2d2d"
                      : call.priority ===
                        "medium"
                      ? "#ff7a00"
                      : "#999",
                }}
              />

              <div
                style={
                  scannerPriority
                }
              >
                {call.priority ||
                  "unknown"}
              </div>
            </div>

           
<h3 style={scannerCallTitle}>
  {(() => {

    const code =
      call.code || "";

    const rawTitle =
      call.title || "";

    /* 🔥 911 CALLS */

    if (
      code.includes("10-911")
    ) {
      return "911 Call";
    }

    /* 🔥 REMOVE EXTRA IDS */

    return rawTitle
      .split(" - ")[0]
      .replace(
        "New Dispatch:",
        ""
      )
      .trim();

  })()}
</h3>


            <p style={scannerDesc}>
              {
                call.description
              }
            </p>

           
           
             
<div style={scannerMeta}>
  🕒{" "}
  {call.createdAt?.seconds
    ? new Date(
        call.createdAt.seconds *
          1000
      ).toLocaleString()
    : "Unknown Time"}
</div>


                                      
          
             
          </div>
        ))}

        {!calls.length && (
          <div style={scannerEmpty}>
            Scanner offline...
          </div>
        )}
      </div>
    </section>
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

/* 🔥 MOBILE */

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

  .scanner-grid {
    grid-template-columns: 1fr !important;
  }

  .scanner-scroll {
    display: flex !important;

    overflow-x: auto;

    overflow-y: hidden;

    scroll-snap-type: x mandatory;

    -webkit-overflow-scrolling: touch;

    gap: 16px;

    padding-bottom: 10px;
  }

  .scanner-scroll::-webkit-scrollbar {
    display: none;
  }

  .scanner-scroll > div {
  width: 85vw;

  min-width: 85vw;

  max-width: 85vw;

  scroll-snap-align: center;

  flex-shrink: 0;

  box-sizing: border-box;
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

const scannerSection = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "80px 20px",
};

const scannerHeader = {
  textAlign: "center" as const,
  marginBottom: "40px",
};

const scannerTag = {
  color: "#ff7a00",
  fontWeight: 800,
  letterSpacing: "2px",
  marginBottom: "12px",
  fontSize: "0.8rem",
};

const scannerTitle = {
  fontSize:
    "clamp(2rem, 5vw, 3.5rem)",
  marginBottom: "12px",
  fontWeight: 900,
};

const scannerSubtitle = {
  opacity: 0.7,
  lineHeight: 1.6,
  maxWidth: "700px",
  margin: "0 auto",
};

const scannerGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const scannerCard = {
  background:
    "rgba(255,255,255,0.03)",

  borderRadius: "24px",

  padding: "24px",

  backdropFilter:
    "blur(14px)",

  boxShadow:
    "0 10px 40px rgba(0,0,0,0.25)",

  overflow: "hidden",

  wordBreak:
    "break-word" as const,
};

const scannerTop = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "16px",
};

const priorityDot = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
};

const scannerPriority = {
  fontSize: "0.8rem",
  textTransform:
    "uppercase" as const,
  opacity: 0.7,
  letterSpacing: "1px",
};

const scannerCallTitle = {
  fontSize: "1.2rem",
  marginBottom: "12px",
  lineHeight: 1.3,
};

const scannerDesc = {
  opacity: 0.75,
  lineHeight: 1.6,
  marginBottom: "18px",
};

const scannerMeta = {
  opacity: 0.9,
  marginBottom: "10px",
};

const scannerUnits = {
  opacity: 0.7,
};

const scannerEmpty = {
  opacity: 0.5,
  padding: "40px",
  textAlign: "center" as const,
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

