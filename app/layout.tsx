import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRIGGA5TREY",
  description: "Official site",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 🔥 iOS APP MODE */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="TRIGGA5TREY" />

        {/* 🔥 REAL iOS SPLASH SCREENS (DEVICE MATCHED) */}

        {/* iPhone 14 / 15 */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-1170x2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* iPhone 14 Pro */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-1179x2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* iPhone 14 Pro Max / 15 Pro Max */}
        <link
          rel="apple-touch-startup-image"
          href="/splash-1290x2796.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          margin: 0,
          backgroundColor: "#000",
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* 🔥 GLOBAL OVERLAY */}
        <div
          style={{
            minHeight: "100vh",
            background: "rgba(0,0,0,0.75)",
          }}
        >
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}