// PUT /api/events/:id
// DELETE /api/events/:id
// Example update input:
/*
{
  "title": "Updated Tech Meetup 2025",
  "isPublic": false
}
*/

import {connect} from '@/dbConfig/dbConfig';
import Event from '@/models/Event';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { id } =  await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const location = JSON.parse(formData.get("location") as string);
    const ticketTypes = JSON.parse(formData.get("ticketTypes") as string);
    const isPublic = formData.get("isPublic") === "true";

    // Cloudinary uploads
    let bannerUrl: string | undefined;
    let brochureUrl: string | undefined;
    let speakerUrls: string[] = [];

    const banner = formData.get("banner") as File | null;
    const brochure = formData.get("brochure") as File | null;
    const speakers = formData.getAll("speakers") as File[];

    if (banner) {
      bannerUrl = await streamUpload(banner, "event_banners");
    }

    if (brochure) {
      brochureUrl = await streamUpload(brochure, "event_brochures");
    }

    if (speakers.length > 0) {
      speakerUrls = await Promise.all(
        speakers.map((speaker, i) => streamUpload(speaker, "event_speakers"))
      );
    }

    const updated = await Event.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        description,
        startDate,
        endDate,
        location,
        ticketTypes,
        isPublic,
        ...(bannerUrl && { bannerUrl }),
        ...(brochureUrl && { brochureUrl }),
        ...(speakerUrls.length > 0 && { speakerImages: speakerUrls }),
      },
      { new: true }
    );

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
