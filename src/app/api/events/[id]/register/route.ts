import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/Event";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const { id } =await params;
    const { userId } =await auth();

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

    // Check if already registered
    const alreadyRegistered = await Event.findOne({
      _id: id,
      "attendees.attendeeId": userId,
    });

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }

    // Check ticket index validity
    const eventDoc = await Event.findById(id);
    if (!eventDoc) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (
      !Array.isArray(eventDoc.ticketTypes) ||
      ticketTypeIndex < 0 ||
      ticketTypeIndex >= eventDoc.ticketTypes.length
    ) {
      return NextResponse.json(
        { error: "Invalid ticket type index" },
        { status: 400 }
      );
    }

    // Perform both attendee push and ticket sold increment in a single update
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        $push: {
          attendees: {
            attendeeId: userId,
            data: formData,
          },
        },
        $inc: {
          [`ticketTypes.${ticketTypeIndex}.sold`]: 1,
        },
      },
      { new: true }
    );

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error: any) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
