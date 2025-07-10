"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Controller,
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { EventFormData } from "../../types/event";
import { useState, useRef, useEffect } from "react";

type Props = {
  control: Control<EventFormData>;
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
  watch: UseFormWatch<EventFormData>;
  setValue: UseFormSetValue<EventFormData>;
};

export default function DetailsTab({
  control,
  register,
  errors,
  watch,
  setValue,
}: Props) {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const speakerInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [speakerPreviews, setSpeakerPreviews] = useState<string[]>([]);
  const [brochurePreview, setBrochurePreview] = useState<boolean>(false);
  const [formBuilderConfig, setFormBuilderConfig] = useState<any | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "FORMALUTE_FORM_CONFIG") {
        setFormBuilderConfig(event.data.payload);
        setValue("formConfig", event.data.payload);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setValue]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("bannerImage", file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSpeakerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) {
      setValue("speakerImages", files);
      setSpeakerPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeSpeakerImage = (index: number) => {
    const newPreviews = speakerPreviews.filter((_, i) => i !== index);
    const newFiles = watch("speakerImages").filter((_, i) => i !== index);
    setSpeakerPreviews(newPreviews);
    setValue("speakerImages", newFiles);
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("brochureFile", file);
      setBrochurePreview(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date & Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register("startDate", { required: true })}
            className="h-11 focus-visible:ring-[#468FAF]"
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">Start date is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">
            End Date & Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endDate"
            type="datetime-local"
            {...register("endDate", { required: true })}
            className="h-11 focus-visible:ring-[#468FAF]"
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">End date is required</p>
          )}
        </div>
      </div>

      {/* Event Type */}
      <div className="space-y-2">
        <Label>Event Type</Label>
        <Controller
          control={control}
          name="location.type"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-11 focus-visible:ring-[#468FAF]">
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

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">
          Location <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="location"
            placeholder="Enter venue address"
            {...register("location.address", { required: true })}
            className="pl-10 h-11 focus-visible:ring-[#468FAF]"
          />
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.location?.address && (
          <p className="text-sm text-red-500">Location is required</p>
        )}
      </div>

      {/* Banner Upload */}
      <div className="space-y-2">
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
            <Upload className="h-4 w-4" /> Upload Banner
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
                className="absolute -right-2 -top-2 h-6 w-6"
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

      {/* Speaker Upload */}
      <div className="space-y-2">
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
            <Upload className="h-4 w-4" /> Upload Speakers
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

      {/* Brochure Upload */}
      <div className="space-y-2">
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
            <Upload className="h-4 w-4" /> Upload Brochure
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
                  setBrochurePreview(false);
                  setValue("brochureFile", null);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form Builder */}
      <div className="space-y-2">
        <Label>Form Builder (Experimental)</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              window.open("/formalute", "_blank", "noopener=false")
            }
          >
            Open Form Builder
          </Button>
          {formBuilderConfig && (
            <Button
              type="button"
              variant="ghost"
              className="text-red-500"
              onClick={() => {
                setFormBuilderConfig(null);
                setValue("formConfig", null);
              }}
            >
              Clear Form
            </Button>
          )}
        </div>
        {formBuilderConfig && (
          <p className="text-sm text-green-600 font-medium">
            ✅ Custom form added successfully!
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Select form fields for attendees to fill out, then click{" "}
          <strong>Publish</strong> to confirm and save the form.
        </p>
      </div>
    </div>
  );
}
