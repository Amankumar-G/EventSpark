import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function POST(
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
      return NextResponse.json({ error: "Invalid Event ID" }, { status: 400 });
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const body = await req.json();
    const { formData, ticketTypeId } = body;

    // ✅ Validate ticketTypeId
    const ticket = event.ticketTypes.find(
      (t: any) => t._id.toString() === ticketTypeId
    );

    if (!ticket || !ticket.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive ticket type" },
        { status: 400 }
      );
    }

    // ✅ Check for existing booking
    const existingBooking = await Booking.findOne({
      event: event._id,
      userId,
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }
    const amount = parseFloat((ticket.price * 1.05).toFixed(2));
    // ✅ Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // in paisa
      currency: "inr",
      metadata: {
        eventId: event._id.toString(),
        userId,
        ticketTypeId: ticketTypeId,
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
