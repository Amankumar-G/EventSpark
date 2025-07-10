import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { connect } from '@/dbConfig/dbConfig';
import Event from "@/models/Event";
import Booking from "@/models/Booking"; // ✅ Use new Booking model

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  const { id } =await params;

  const event = await Event.findById(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // ✅ Fetch attendees from Booking model
  const bookings = await Booking.find({ event: id }).lean();

  type AttendeeRow = { AttendeeID: string; [key: string]: unknown };

  const rows: AttendeeRow[] = bookings.map((booking) => ({
    AttendeeID: booking.attendeeId,
    ...booking.formData, // spread formData fields into Excel row
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendees");

  if (rows.length > 0) {
    worksheet.columns = Object.keys(rows[0]).map((key) => ({
      header: key,
      key,
      width: 25,
    }));
    worksheet.addRows(rows);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return NextResponse.json({
    attendees: rows,
    excelBase64: base64,
  });
}
