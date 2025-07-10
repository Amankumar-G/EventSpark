import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await Booking.find({ userId }).populate({
      path: "event",
      select: "title date location slug ticketTypes bannerUrl", 
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: unknown) {
     const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error:errorMessage },
      { status: 500 }
    );
  }
}
