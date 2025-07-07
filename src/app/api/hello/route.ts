// src/app/api/hello/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch full user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}