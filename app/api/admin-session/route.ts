import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const session = cookieStore.get("trigga5trey_admin");

    if (
      session &&
      session.value === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({
        authenticated: true,
      });
    }

    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 }
    );

  } catch (err) {
    console.error("SESSION CHECK ERROR:", err);

    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 500 }
    );
  }
}