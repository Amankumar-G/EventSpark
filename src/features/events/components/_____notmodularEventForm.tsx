"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  X,
  CalendarIcon,
  MapPin,
  Ticket,
  Users,
  Globe,
  ImageIcon,
  FileText,
  Upload,
  Edit,
} from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Updated type definitions
interface EventWithDetails {
  _id: string | { toString(): string }
  title: string
  slug: string
  description: string
  startDate: string | Date
  endDate: string | Date
  location: {
    type: string
    address: string
    onlneUrl? : string
  }
  ticketTypes: Array<{
    name: string
    price: number
    isActive?: boolean
    sold?: number
  }>
  isPublic?: boolean
  status: 'active' | 'pending' | 'draft' | 'cancelled'
  bannerUrl?: string
}

type TicketType = { name: string; price: number; isActive: boolean };

type FormData = {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  location: { type: string; address: string };
  ticketTypes: TicketType[];
  isPublic: boolean;
  bannerImage: File | null;
  brochureFile: File | null;
  speakerImages: File[];
};

type CreateEventModalProps = {
  initialData?: EventWithDetails;
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

// Type guard function
const isEventWithDetails = (data: any): data is EventWithDetails => {
  return data && typeof data._id !== 'undefined' && data.ticketTypes && Array.isArray(data.ticketTypes);
};

// Conversion function
const convertEventToFormData = (event: EventWithDetails): Partial<FormData> => {
  // Handle _id conversion
  const eventId = typeof event._id === 'string' ? event._id : event._id.toString();
  
  // Handle date conversion
  const startDate = event.startDate instanceof Date 
    ? event.startDate.toISOString().slice(0, 16)
    : new Date(event.startDate).toISOString().slice(0, 16);
    
  const endDate = event.endDate instanceof Date 
    ? event.endDate.toISOString().slice(0, 16)
    : new Date(event.endDate).toISOString().slice(0, 16);

  return {
    _id: eventId,
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: startDate,
    endDate: endDate,
    location: {
      type: event.location.type || 'offline',
      address: event.location.address
    },
    ticketTypes: event.ticketTypes.map(ticket => ({
      name: ticket.name,
      price: ticket.price,
      isActive: ticket.isActive ?? true
    })),
    isPublic: event.isPublic ?? true,
  };
};

export function CreateEventModal({
  initialData,
  mode = "create",
  onSuccess,
}: CreateEventModalProps) {
  const [open, setOpen] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [speakerPreviews, setSpeakerPreviews] = useState<string[]>([]);
  const [brochurePreview, setBrochurePreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const speakerInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (brochurePreview) {
        URL.revokeObjectURL(brochurePreview);
      }
    };
  }, [brochurePreview]);

  const getDefaultValues = (initialData?: Partial<FormData>): FormData => {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    return {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      startDate: initialData?.startDate ?? now.toISOString().slice(0, 16),
      endDate: initialData?.endDate ?? twoHoursLater.toISOString().slice(0, 16),
      location: initialData?.location ?? { type: "offline", address: "" },
      ticketTypes: initialData?.ticketTypes ?? [
        { name: "General Admission", price: 100, isActive: true },
      ],
      isPublic: initialData?.isPublic ?? true,
      bannerImage: null,
      brochureFile: null,
      speakerImages: [],
    };
  };

  // Convert initialData if it's an EventWithDetails
  const formInitialData = initialData ? convertEventToFormData(initialData) : undefined;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getDefaultValues(formInitialData),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
        setValue("bannerImage", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("brochureFile", file);
      setBrochurePreview(URL.createObjectURL(file));
    }
  };

  const handleSpeakerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews: string[] = [];
      const newImages: File[] = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result as string);
          newImages.push(file);

          if (newPreviews.length === files.length) {
            setSpeakerPreviews((prev) => [...prev, ...newPreviews]);
            setValue("speakerImages", [
              ...watch("speakerImages"),
              ...newImages,
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeSpeakerImage = (index: number) => {
    const updatedPreviews = [...speakerPreviews];
    updatedPreviews.splice(index, 1);
    setSpeakerPreviews(updatedPreviews);

    const updatedImages = [...watch("speakerImages")];
    updatedImages.splice(index, 1);
    setValue("speakerImages", updatedImages);
  };

  const onSubmit = async (data: FormData) => {
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
    data.speakerImages.forEach((img, index) =>
      formData.append(`speakers`, img)
    );
 
    try {
      if (mode === "edit" && !data._id) {
        console.error("Event ID is required for editing");
        return;
      }

      const res = await fetch(
        mode === "edit" ? `/api/events/${data._id}` : "/api/events",
        {
          method: mode === "edit" ? "PUT" : "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {mode === "edit" ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              Fill in all the required details to {mode === "edit" ? "update" : "create"} your event
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">
                <Users className="h-4 w-4 mr-2" /> Basic Info
              </TabsTrigger>
              <TabsTrigger value="details">
                <CalendarIcon className="h-4 w-4 mr-2" /> Event Details
              </TabsTrigger>
              <TabsTrigger value="tickets">
                <Ticket className="h-4 w-4 mr-2" /> Tickets
              </TabsTrigger>
            </TabsList>

            <div className="border rounded-lg p-6 mt-4">
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      Event Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Tech Conference 2023"
                      {...register("title", { required: true })}
                      className="focus-visible:ring-[#468FAF] h-11"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        Event title is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="slug" className="flex items-center gap-2">
                      Event URL <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm">
                        eventspark.com/
                      </span>
                      <Input
                        id="slug"
                        placeholder="tech-conference-2023"
                        {...register("slug", { required: true })}
                        className="flex-1 focus-visible:ring-[#468FAF] rounded-l-none h-11"
                      />
                    </div>
                    {errors.slug && (
                      <p className="text-sm text-red-500">
                        Event URL is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell attendees about your event..."
                    {...register("description", { required: true })}
                    className="min-h-[120px] focus-visible:ring-[#468FAF]"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      Description is required
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="startDate"
                      className="flex items-center gap-2"
                    >
                      Start Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="startDate"
                        type="datetime-local"
                        {...register("startDate", { required: true })}
                        className="focus-visible:ring-[#468FAF] h-11"
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-500">
                          Start date is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="endDate"
                      className="flex items-center gap-2"
                    >
                      End Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="endDate"
                        type="datetime-local"
                        {...register("endDate", { required: true })}
                        className="focus-visible:ring-[#468FAF] h-11"
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-500">
                          End date is required
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Event Type</Label>
                  <Controller
                    control={control}
                    name="location.type"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="focus:ring-[#468FAF] h-11">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="location"
                      placeholder="Enter venue address"
                      {...register("location.address", { required: true })}
                      className="pl-10 focus-visible:ring-[#468FAF] h-11"
                    />
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    {errors.location?.address && (
                      <p className="text-sm text-red-500">
                        Location is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Banner Image</Label>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => bannerInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Banner
                    </Button>
                    {bannerPreview && (
                      <div className="relative">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="h-20 w-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setBannerPreview(null);
                            setValue("bannerImage", null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Speaker Images</Label>
                  <input
                    type="file"
                    ref={speakerInputRef}
                    onChange={handleSpeakerUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => speakerInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Speakers
                    </Button>
                    {speakerPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Speaker ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                          onClick={() => removeSpeakerImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Brochure File</Label>
                  <input
                    type="file"
                    ref={brochureInputRef}
                    onChange={handleBrochureUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => brochureInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Brochure
                    </Button>
                    {brochurePreview && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Brochure uploaded
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setBrochurePreview(null);
                            setValue("brochureFile", null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tickets" className="space-y-6">
                <div className="space-y-3">
                  <Label>Ticket Types</Label>
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-3 items-center p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="col-span-5">
                          <Input
                            placeholder="Ticket name"
                            {...register(`ticketTypes.${index}.name`, {
                              required: true,
                            })}
                            className="focus-visible:ring-[#468FAF] h-9"
                          />
                        </div>
                        <div className="col-span-4">
                          <Input
                            placeholder="Price"
                            type="number"
                            {...register(`ticketTypes.${index}.price`, {
                              required: true,
                              valueAsNumber: true,
                            })}
                            className="focus-visible:ring-[#468FAF] h-9"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <Controller
                            control={control}
                            name={`ticketTypes.${index}.isActive`}
                            render={({ field: { onChange, value } }) => (
                              <Switch
                                checked={value}
                                onCheckedChange={onChange}
                                className="data-[state=checked]:bg-[#468FAF]"
                              />
                            )}
                          />
                          <span className="text-sm">
                            {watch(`ticketTypes.${index}.isActive`)
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full h-10"
                    onClick={() =>
                      append({ name: "", price: 0, isActive: true })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-6 flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Controller
                control={control}
                name="isPublic"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="public"
                    checked={value}
                    onCheckedChange={onChange}
                    className="data-[state=checked]:bg-[#468FAF]"
                  />
                )}
              />

              <Label htmlFor="public" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Make this event public
              </Label>
            </div>
            {initialData?._id && (
                <input type="hidden" {...register("_id")} value={initialData._id.toString()} />
              )}

            <Button
              type="submit"
              className="bg-[#468FAF] hover:bg-[#3a7a99] px-6"
            >
              {mode === "edit" ? "Update Event" : "Create Event"}
            </Button>
            
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
