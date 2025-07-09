import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { connect } from '@/dbConfig/dbConfig';// your DB connect helper
import Event from "@/models/Event"; // your Mongoose Event model

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  const {id} = await params
  const event = await Event.findById(id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const attendees = event.attendees || [];

  type Attendee = { attendeeId: string; data: Record<string, any> };

  const rows = (attendees as Attendee[]).map(({ attendeeId, data }) => ({
    AttendeeID: attendeeId,
    ...data,
  }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendees");

  // Dynamically create columns from first data row
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
