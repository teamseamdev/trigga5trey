"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);

  /* 🔥 Analytics */
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNotifications, setTotalNotifications] =
    useState(0);
  const [liveAlerts, setLiveAlerts] = useState(0);

  const [activity, setActivity] = useState<any[]>([]);

  /* 🔥 Check existing session */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin-session");

        if (res.ok) {
          setAuthed(true);
        }

      } catch (err) {
        console.error(err);
      }

      setCheckingAuth(false);
    };

    checkSession();
  }, []);

  /* 🔥 Load analytics */
  useEffect(() => {
    if (!authed) return;

    const loadAnalytics = async () => {
      try {
        const tokenSnap = await getDocs(
          collection(db, "tokens")
        );

        setTotalUsers(tokenSnap.size);

        const notifSnap = await getDocs(
          collection(db, "notifications")
        );

        setTotalNotifications(notifSnap.size);

        const liveCount = notifSnap.docs.filter(
          (doc) => doc.data()?.type === "live"
        ).length;

        setLiveAlerts(liveCount);

      } catch (err) {
        console.error(err);
      }
    };

    loadAnalytics();

    /* 🔥 Realtime activity feed */
    const q = query(
      collection(db, "activity"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setActivity(items);
    });

    return () => unsub();

  }, [authed]);

  const login = async () => {
    try {
      const res = await fetch("/api/admin-auth", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAuthed(true);
        setPassword("");
      } else {
        alert("❌ Wrong password");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const logout = () => {
    document.cookie =
      "trigga5trey_admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setAuthed(false);
  };

  const sendNotification = async () => {
    if (!title || !body) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/broadcast", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          url: "/live",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Sent to ${data.sent} users`);

        setTitle("");
        setBody("");
      } else {
        alert("❌ Failed");
      }

    } catch (err) {
      console.error(err);
      alert("Send failed");
    }

    setLoading(false);
  };

  /* 🔥 Prevent hydration flicker */
  if (checkingAuth) return null;

  /* 🔒 LOGIN SCREEN */
  if (!authed) {
    return (
      <main style={wrapper}>
        <h1>🔒 Admin Login</h1>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={input}
        />

        <button onClick={login} style={button}>
          Login
        </button>
      </main>
    );
  }

  /* 📊 ADMIN DASHBOARD */
  return (
    <main style={wrapper}>
      <div style={headerRow}>
        <h1 style={{ margin: 0 }}>
          📊 Analytics Dashboard
        </h1>

        <button
          onClick={logout}
          style={logoutButton}
        >
          Logout
        </button>
      </div>

      {/* 🔥 METRICS */}
      <div style={statsGrid}>
        <StatCard
          label="Active Users"
          value={totalUsers}
        />

        <StatCard
          label="Notifications"
          value={totalNotifications}
        />

        <StatCard
          label="Live Alerts"
          value={liveAlerts}
        />
      </div>

      {/* 🔥 SEND PANEL */}
      <div style={panel}>
        <h2 style={panelTitle}>
          📢 Send Notification
        </h2>

        <input
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Notification Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            ...input,
            height: 120,
            resize: "none",
          }}
        />

        <button
          onClick={sendNotification}
          style={button}
        >
          {loading
            ? "Sending..."
            : "Send Notification 🚀"}
        </button>
      </div>

      {/* 🔥 ACTIVITY FEED */}
      <div style={panel}>
        <h2 style={panelTitle}>
          ⚡ Recent Activity
        </h2>

        <div style={activityList}>
          {activity.map((item) => (
            <div
              key={item.id}
              style={activityItem}
            >
              <div style={activityContent}>
                <div style={activityTitle}>
                  {item.title || item.message}
                </div>

                {item.body && (
                  <div style={activityBody}>
                    {item.body}
                  </div>
                )}
              </div>

              <div style={activityType}>
                {item.type || "notification"}
              </div>
            </div>
          ))}

          {!activity.length && (
            <div style={{ opacity: 0.5 }}>
              No activity yet
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* 🔥 COMPONENTS */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={statCard}>
      <div style={statValue}>{value}</div>

      <div style={statLabel}>{label}</div>
    </div>
  );
}

/* 🔥 STYLES */

const wrapper = {
  maxWidth: "1200px",
  margin: "0 auto",
  minHeight: "100vh",
  padding: "90px 20px 50px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "24px",
  color: "#fff",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const statCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "22px",
  padding: "28px",
  backdropFilter: "blur(12px)",
};

const statValue = {
  fontSize: "2.5rem",
  fontWeight: 900,
  marginBottom: "10px",
};

const statLabel = {
  opacity: 0.7,
};

const panel = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "24px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
  backdropFilter: "blur(12px)",
};

const panelTitle = {
  margin: 0,
};

const input = {
  padding: "14px",
  borderRadius: "14px",
  border:
    "1px solid rgba(255,255,255,0.1)",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
};

const button = {
  padding: "14px",
  background:
    "linear-gradient(135deg, #ff7a00 0%, #ff9a2f 100%)",
  borderRadius: "14px",
  color: "#000",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const logoutButton = {
  padding: "10px 14px",
  background: "#222",
  borderRadius: "10px",
  color: "#fff",
  border: "1px solid #333",
  cursor: "pointer",
};

const activityList = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
};

const activityItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  padding: "16px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.03)",
  border:
    "1px solid rgba(255,255,255,0.06)",
};

const activityContent = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
  flex: 1,
};

const activityTitle = {
  fontWeight: 700,
};

const activityBody = {
  opacity: 0.7,
  fontSize: "0.92rem",
  lineHeight: 1.4,
};

const activityType = {
  fontSize: "0.78rem",
  opacity: 0.6,
  textTransform: "uppercase" as const,
};