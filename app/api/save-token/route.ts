import { NextResponse } from "next/server";
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

function saveTokens(tokens: string[]) {
  fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
}

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 400 });
  }

  const tokens = getTokens();

  if (!tokens.includes(token)) {
    tokens.push(token);
    saveTokens(tokens);
  }

  return NextResponse.json({ success: true });
}