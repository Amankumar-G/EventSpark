"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

export default function AttendeeModal({
  eventId,
  open,
  onClose,
}: {
  eventId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [groups, setGroups] = useState<any[][]>([]);
  const [excelBase64, setExcelBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetch(`/api/events/${eventId}/attendees/`)
        .then((res) => res.json())
        .then((data) => {
          setGroups(data.groups || []);
          setExcelBase64(data.excelBase64 || "");
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, eventId]);

  const handleDownload = () => {
    if (!excelBase64) return;
    const blob = new Blob(
      [Uint8Array.from(atob(excelBase64), (c) => c.charCodeAt(0))],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );
    saveAs(blob, "attendees.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] h-[95vh] flex flex-col p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-2xl font-bold">Attendee List</DialogTitle>
        </DialogHeader>

        <div className="p-6 flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading attendees..."
                : `${groups.reduce((acc, g) => acc + g.length, 0)} attendees registered`}
            </p>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="gap-2"
              disabled={!excelBase64}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export to Excel
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden flex-1 bg-background">
            <div className="relative h-full overflow-auto p-4 space-y-12">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
                </div>
              ) : groups.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No attendees found.
                </div>
              ) : (
                groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <table className="w-full text-sm border border-muted rounded-md overflow-hidden">
                      <thead className="bg-muted/40 sticky top-0 z-10 backdrop-blur">
                        <tr>
                          {Object.keys(group[0] || {}).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left font-medium text-muted-foreground uppercase tracking-wide border-b"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-t hover:bg-muted/20 transition"
                          >
                            {Object.values(row).map((val, i) => (
                              <td
                                key={i}
                                className="px-4 py-2 max-w-[200px] truncate"
                              >
                                {typeof val === "object"
                                  ? JSON.stringify(val)
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
