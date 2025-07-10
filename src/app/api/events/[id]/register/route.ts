import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/Event";
import Booking from "@/models/Booking"; // ✅ New
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

// await fetch(`/api/events/${eventId}/register`, {
//   method: 'PUT',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     ticketTypeIndex,
//     ...formData, // user details
//   }),
// });

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Event ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { ticketTypeIndex, ...formData } = body;
    if (typeof ticketTypeIndex !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid ticketTypeIndex" },
        { status: 400 }
      );
    }

    // Check if user already booked
    const existingBooking = await Booking.findOne({
      eventId: id,
      attendeeId: userId,
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Validate ticket index
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (
      !Array.isArray(event.ticketTypes) ||
      ticketTypeIndex < 0 ||
      ticketTypeIndex >= event.ticketTypes.length
    ) {
      return NextResponse.json(
        { error: "Invalid ticket type index" },
        { status: 400 }
      );
    }

    // Create booking
    const newBooking = new Booking({
      event: event._id,
      userId,
      ticketTypeIndex,
      formData,
    });

    await newBooking.save();

    // Increment sold count
    event.ticketTypes[ticketTypeIndex].sold += 1;
    await event.save();

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
