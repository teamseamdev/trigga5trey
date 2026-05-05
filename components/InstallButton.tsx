"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;

    // detect iOS
    setIsIOS(/iPhone|iPad|iPod/i.test(ua));

    // detect if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    // Android install event
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  if (installed) return null;

  return (
    <div style={wrapper}>
      {isIOS ? (
        <p style={text}>
          📲 Tap <strong>Share</strong> →{" "}
          <strong>Add to Home Screen</strong>
        </p>
      ) : (
        deferredPrompt && (
          <button onClick={handleInstall} style={button}>
            Install App
          </button>
        )
      )}
    </div>
  );
}

/* styles */

const wrapper = {
  position: "fixed" as const,
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 999,
};

const button = {
  background: "#ff7a00",
  color: "#000",
  padding: "12px 20px",
  borderRadius: "10px",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const text = {
  background: "rgba(0,0,0,0.8)",
  padding: "10px 15px",
  borderRadius: "10px",
  fontSize: "14px",
};