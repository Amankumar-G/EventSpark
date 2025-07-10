
import {connect} from '@/dbConfig/dbConfig';
import Event from '@/models/Event';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server'
import { IEvent } from "@/models/Event";
import Booking from "@/models/Booking"; // ✅ Add this import

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


const streamUpload = (file: File, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const buffer = file.arrayBuffer().then((buf) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (result?.secure_url) resolve(result.secure_url);
          else reject(error);
        }
      );

      stream.end(Buffer.from(buf));
    });
  });
};


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    
    const { userId: clerkId } = await auth();
    const { id } =await params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing event ID" }, { status: 400 });
    }

    const event = await Event.findOne({ slug: id }).lean<IEvent>();
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // ✅ Replaced old logic that checked Event.attendees with Booking query
    const existingBooking = await Booking.findOne({
      eventId: event._id,
      attendeeId: clerkId,
    });

    const isRegistered = !!existingBooking;

    // Add registered flag
    const responseEvent = { ...event, registered: isRegistered };

    return NextResponse.json({ success: true, event: responseEvent }, { status: 200 });

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const formData = await req.formData();

    const updatePayload: any = {};

    const title = formData.get("title");
    if (title) updatePayload.title = title;

    const slug = formData.get("slug");
    if (slug) updatePayload.slug = slug;

    const description = formData.get("description");
    if (description) updatePayload.description = description;

    const startDate = formData.get("startDate");
    if (startDate) updatePayload.startDate = startDate;

    const endDate = formData.get("endDate");
    if (endDate) updatePayload.endDate = endDate;

    const locationRaw = formData.get("location");
    if (locationRaw && locationRaw !== "undefined") {
      try {
        updatePayload.location = JSON.parse(locationRaw as string);
      } catch (err) {
        return NextResponse.json({ success: false, error: "Invalid JSON in location" }, { status: 400 });
      }
    }

    const ticketTypesRaw = formData.get("ticketTypes");
    if (ticketTypesRaw && ticketTypesRaw !== "undefined") {
      try {
        updatePayload.ticketTypes = JSON.parse(ticketTypesRaw as string);
      } catch (err) {
        return NextResponse.json({ success: false, error: "Invalid JSON in ticketTypes" }, { status: 400 });
      }
    }

    const isPublicRaw = formData.get("isPublic");
    if (isPublicRaw !== null) updatePayload.isPublic = isPublicRaw === "true";

    const formConfigRaw = formData.get("formConfig");
    if (formConfigRaw && formConfigRaw !== "undefined") {
      try {
        updatePayload.formConfig = JSON.parse(formConfigRaw as string);
      } catch (err) {
        return NextResponse.json({ success: false, error: "Invalid JSON in formConfig" }, { status: 400 });
      }
    }

    // Handle file uploads only if provided
    const banner = formData.get("banner") as File | null;
    if (banner && banner.name) {
      updatePayload.bannerUrl = await streamUpload(banner, "event_banners");
    }

    const brochure = formData.get("brochure") as File | null;
    if (brochure && brochure.name) {
      updatePayload.brochureUrl = await streamUpload(brochure, "event_brochures");
    }

    const speakers = formData.getAll("speakers") as File[];
    if (speakers && speakers.length > 0) {
      const uploaded = await Promise.all(
        speakers.map((speaker) => streamUpload(speaker, "event_speakers"))
      );
      updatePayload.speakerImages = uploaded;
    }

    const updated = await Event.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    console.error("Cloudinary PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
