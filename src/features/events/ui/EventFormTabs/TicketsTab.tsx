"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
  UseFormWatch,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { EventFormData } from "../../types/event";

type Props = {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
  control: Control<EventFormData>;
  fields: { id: string }[];
  append: UseFieldArrayAppend<EventFormData, "ticketTypes">;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<EventFormData>;
};

export default function TicketsTab({
  register,
  errors,
  control,
  fields,
  append,
  remove,
  watch,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Ticket Types</Label>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl border"
          >
            {/* Ticket Name */}
            <div className="col-span-5 space-y-1">
              <Input
                placeholder="Ticket name"
                {...register(`ticketTypes.${index}.name`, { required: true })}
                className="h-10 focus-visible:ring-[#468FAF]"
              />
              {errors.ticketTypes?.[index]?.name && (
                <p className="text-sm text-red-500">Ticket name is required</p>
              )}
            </div>

            {/* Ticket Price */}
            <div className="col-span-4 space-y-1">
              <Input
                placeholder="Price"
                type="number"
                {...register(`ticketTypes.${index}.price`, {
                  required: "Price is required",
                  valueAsNumber: true,
                  validate: (value) => {
                    if (value === 0) return true; // Allow 0
                    if (value >= 50) return true; // Allow 50 and up
                    return "Price must be 0 or at least ₹50";
                  },
                })}
                className="h-10 focus-visible:ring-[#468FAF]"
              />
              {errors.ticketTypes?.[index]?.price && (
                <p className="text-sm text-red-500">
                  {errors.ticketTypes[index]?.price?.message}
                </p>
              )}
            </div>

            {/* Switch */}
            <div className="col-span-2 flex items-center gap-2 justify-center">
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
                {watch(`ticketTypes.${index}.isActive`) ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Remove Button */}
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

      {/* Add Button */}
      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full h-10"
          onClick={() => append({ name: "", price: 0, isActive: true })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ticket Type
        </Button>
      </div>
    </div>
  );
}
