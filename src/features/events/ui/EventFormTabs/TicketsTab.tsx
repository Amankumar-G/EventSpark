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
                {...register(`ticketTypes.${index}.name`, { required: true })}
                className="focus-visible:ring-[#468FAF] h-9"
              />
              {errors.ticketTypes?.[index]?.name && (
                <p className="text-sm text-red-500 mt-1">
                  Ticket name is required
                </p>
              )}
            </div>

            <div className="col-span-4">
              <Input
                placeholder="Price"
                type="number"
                {...register(`ticketTypes.${index}.price`, {
                  required: true,
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                })}
                className="focus-visible:ring-[#468FAF] h-9"
              />
              {errors.ticketTypes?.[index]?.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.ticketTypes[index]?.price?.message ||
                    "Price is required"}
                </p>
              )}
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
                {watch(`ticketTypes.${index}.isActive`) ? "Active" : "Inactive"}
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
        onClick={() => append({ name: "", price: 0, isActive: true })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Ticket Type
      </Button>
    </div>
  );
}
