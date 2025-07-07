import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import Event from '@/models/Event';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

  
    const newStatus =  'active'; 

    const updated = await Event.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
