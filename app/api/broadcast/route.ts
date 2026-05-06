import { NextResponse } from "next/server";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "tokens.json");

function getTokens(): string[] {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 🔥 init firebase (reuse your logic)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  const { title, body } = await req.json();

  const tokens = getTokens();

  if (!tokens.length) {
    return NextResponse.json({ error: "No users" }, { status: 400 });
  }

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
  });

  return NextResponse.json({
    success: true,
    sent: response.successCount,
  });
}