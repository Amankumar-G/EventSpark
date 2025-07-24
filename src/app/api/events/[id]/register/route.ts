import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { id } = await context.params;
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
    const { ticketTypeId, ...formData } = body;

    if (!ticketTypeId || typeof ticketTypeId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid ticketTypeId" },
        { status: 400 }
      );
    }

    // ✅ Check for existing booking
    const existingBooking = await Booking.findOne({
      event: id,
      userId,
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // ✅ Fetch event and validate ticketTypeId
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const ticketIndex = event.ticketTypes.findIndex(
      (ticket: any) => ticket._id.toString() === ticketTypeId
    );

    if (ticketIndex === -1) {
      return NextResponse.json(
        { error: "Ticket type not found" },
        { status: 400 }
      );
    }

    const ticket = event.ticketTypes[ticketIndex];

    if (!ticket.isActive) {
      return NextResponse.json(
        { error: "Ticket type is inactive" },
        { status: 400 }
      );
    }

    // ✅ Create booking
    const newBooking = new Booking({
      event: event._id,
      userId,
      ticketTypeId,
      formData,
    });

    await newBooking.save();

    // ✅ Increment ticket sold count
    event.ticketTypes[ticketIndex].sold += 1;
    await event.save();

    const platformFee = parseFloat((ticket.price * 0.05).toFixed(2));
    const totalWithFee = parseFloat((ticket.price * 1.05).toFixed(2));
    const basePrice = ticket.price;

    await User.findOneAndUpdate(
      { clerkId: userId },
      { $inc: { totalAmount: totalWithFee } }
    );

    const organizerUser = await User.findById(event.organizer);

    if (organizerUser) {
      await User.findByIdAndUpdate(organizerUser._id, {
        $inc: { totalAmount: basePrice },
      });
    }

    await User.updateOne(
      { role: "admin" },
      { $inc: { totalAmount: platformFee } }
    );

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
