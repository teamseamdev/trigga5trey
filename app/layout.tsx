import type { Metadata } from "next";
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
  themeColor: "#000000",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-orange.png",
  },
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

        {/* 🔥 SPLASH SCREEN */}
        <link rel="apple-touch-startup-image" href="/splash.png" />
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
        {/* 🔥 GLOBAL OVERLAY (important for readability) */}
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