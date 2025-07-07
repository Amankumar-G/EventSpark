"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { EventForm } from "../ui/EventForm";
import type { EventWithDetails } from "../types/event";

type Props = {
  initialData?: EventWithDetails;
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

export function CreateEventModal({ initialData, mode = "create", onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#468FAF] hover:bg-[#3a7a99] flex items-center gap-2">
          {mode === "edit" ? (
            <>
              <Edit className="h-4 w-4" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Event
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            Fill in the form to {mode === "edit" ? "update" : "create"} your event
          </DialogDescription>
        </DialogHeader>

        <EventForm
          initialData={initialData}
          mode={mode}
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
