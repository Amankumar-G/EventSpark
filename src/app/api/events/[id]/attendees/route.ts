import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
type AttendeeRow = { AttendeeID: string; [key: string]: any };

function generateFieldSetHash(obj: Record<string, any>): string {
  return Object.keys(obj).sort().join("|");
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connect();
  const { id } = await context.params;

  const eventResult = await Event.findById(id).lean();
  const event = Array.isArray(eventResult) ? eventResult[0] : eventResult;
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const bookings = await Booking.find({ event: id }).select("-userId").lean();

  const groupedRows: Record<string, AttendeeRow[]> = {};
  const uniqueHashes = new Set<string>();

  for (const booking of bookings) {
    const formData = booking.formData || {};

    // 🔍 Get ticket type name from the event.ticketTypes array
    const ticket = event.ticketTypes.find(
      (t: any) => t._id.toString() === booking.ticketTypeId.toString()
    );
    const ticketName = ticket?.name || "Unknown Ticket";

    const row: AttendeeRow = {
      TicketType: ticketName, // ✅ Add TicketType name
      ...formData,
    };

    const hash = generateFieldSetHash(row); // include ticket name in hash
    uniqueHashes.add(hash);

    if (!groupedRows[hash]) groupedRows[hash] = [];
    groupedRows[hash].push(row);
  }

  // ✅ Excel setup
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendees");

  for (const hash of Array.from(uniqueHashes)) {
    const rows = groupedRows[hash];
    if (!rows || rows.length === 0) continue;

    const allKeys = Object.keys(rows[0]);

    worksheet.addRow([]);
    worksheet.addRow([]);

    worksheet.addRow(allKeys); // Header row

    for (const row of rows) {
      const rowData = allKeys.map((key) => row[key] || "");
      worksheet.addRow(rowData);
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return NextResponse.json({
    groups: Object.values(groupedRows),
    excelBase64: base64,
  });
}
