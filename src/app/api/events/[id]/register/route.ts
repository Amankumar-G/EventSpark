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

    const { id } = await params; // ✅ no need for `await` here
    const { userId } = await auth(); // ✅ no need to await `auth()`; it returns synchronously

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Event ID" },
        { status: 400 }
      );
    }

    const body = await req.json(); // ✅ still needed
    
    const alreadyRegistered = await Event.findOne({
      _id: id,
      "attendees.attendeeId": userId, // Clerk user ID is a string
    });

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }

    const registered = await Event.findByIdAndUpdate(
      id,
      {
        $push: {
          attendees: {
            attendeeId: userId, // ✅ just use the string
            data: body,
          },
        },
      },
      { new: true }
    );

    if (!registered) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, event: registered });
  } catch (error: any) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
