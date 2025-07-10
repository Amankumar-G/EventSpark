import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/Event";
import Booking from "@/models/Booking"; // ✅ New Booking model
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(
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
      return NextResponse.json({ error: "Invalid Event ID" }, { status: 400 });
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await req.json();
    const { formData, ticketTypeIndex } = body;

    // Validate ticket
    const ticket = event.ticketTypes[ticketTypeIndex];
    if (!ticket || !ticket.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive ticket" },
        { status: 400 }
      );
    }

    // ✅ Check in Booking model instead of Event.attendees
    const existingBooking = await Booking.findOne({
      eventId: event._id,
      attendeeId: userId,
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }

    // ✅ Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticket.price * 100, // convert to paisa
      currency: "inr",
      metadata: {
        eventId: event._id.toString(),
        userId,
        ticketTypeIndex: ticketTypeIndex.toString(),
        attendeeFormData: JSON.stringify(formData),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
