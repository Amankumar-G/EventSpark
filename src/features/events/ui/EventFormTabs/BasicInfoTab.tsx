import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EventFormData } from "../../types/event";

type Props = {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
};

export default function BasicInfoTab({ register, errors }: Props) {
  return (
    <>
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
            <p className="text-sm text-red-500">Event title is required</p>
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
            <p className="text-sm text-red-500">Event URL is required</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="description" className="flex items-center gap-2">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Tell attendees about your event..."
          {...register("description", { required: true })}
          className="min-h-[120px] focus-visible:ring-[#468FAF]"
        />
        {errors.description && (
          <p className="text-sm text-red-500">Description is required</p>
        )}
      </div>
    </>
  );
}
