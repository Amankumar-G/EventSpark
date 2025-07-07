"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { EventWithDetails, EventFormData } from "../types/event";
import BasicInfoTab from "./EventFormTabs/BasicInfoTab";
import DetailsTab from "./EventFormTabs/DetailsTab";
import TicketsTab from "./EventFormTabs/TicketsTab";

const convertEventToFormData = (event?: EventWithDetails): EventFormData => {
  if (!event) {
    return {
      _id: "",
      title: "",
      slug: "",
      description: "",
      startDate: "",
      endDate: "",
      location: {
        type: "offline",
        address: "",
      },
      ticketTypes: [],
      isPublic: true,
      bannerImage: null,
      brochureFile: null,
      speakerImages: [],
    };
  }

  const eventId = typeof event._id === "string" ? event._id : event._id.toString();
  const startDate = new Date(event.startDate).toISOString().slice(0, 16);
  const endDate = new Date(event.endDate).toISOString().slice(0, 16);

  return {
    _id: eventId,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate,
    endDate,
    location: {
      type: event.location.type || "offline",
      address: event.location.address,
    },
    ticketTypes: event.ticketTypes.map((ticket) => ({
      name: ticket.name,
      price: ticket.price,
      isActive: ticket.isActive ?? true,
    })),
    isPublic: event.isPublic ?? true,
    bannerImage: null,
    brochureFile: null,
    speakerImages: [],
  };
};


type Props = {
  initialData?: EventWithDetails;
  mode: "create" | "edit";
  onSuccess: () => void;
};

export function EventForm({ initialData, mode, onSuccess }: Props) {
  const defaultValues = convertEventToFormData(initialData);

  const form = useForm<EventFormData>({
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  const onSubmit = async (data: EventFormData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("location", JSON.stringify(data.location));
    formData.append("ticketTypes", JSON.stringify(data.ticketTypes));
    formData.append("isPublic", data.isPublic.toString());

    if (data.bannerImage) formData.append("banner", data.bannerImage);
    if (data.brochureFile) formData.append("brochure", data.brochureFile);
    data.speakerImages.forEach((img) => formData.append("speakers", img));

    try {
      const res = await fetch(
        mode === "edit" ? `/api/events/${data._id}` : "/api/events",
        {
          method: mode === "edit" ? "PUT" : "POST",
          body: formData,
        }
      );
      await res.json();
      onSuccess();
    } catch (err) {
      console.error("Event save error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        <div className="border rounded-lg p-6 mt-4">
          <TabsContent value="basic">
            <BasicInfoTab register={register} errors={errors} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab
              control={control}
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </TabsContent>
          <TabsContent value="tickets">
            <TicketsTab
              control={control}
              register={register}
              errors={errors}
              fields={fields}
              append={append}
              remove={remove}
              watch={watch}
            />
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-6 flex justify-between items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Controller
            control={control}
            name="isPublic"
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Make this event public
          </label>
        </div>
        <Button type="submit" className="bg-[#468FAF] hover:bg-[#3a7a99] px-6">
          {mode === "edit" ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
    