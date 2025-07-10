import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EventWithDetails } from "@/features/events/types/event";

export const EventFilters = ({
  categoryFilter,
  setCategoryFilter,
  locationTypeFilter,
  setLocationTypeFilter,
  priceFilter,
  setPriceFilter,
  dateFilter,
  setDateFilter,
  clearFilters,
  events,
}: {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  locationTypeFilter: string;
  setLocationTypeFilter: (value: string) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (value: Date | undefined) => void;
  clearFilters: () => void;
  events: EventWithDetails[];
}) => {
  const uniqueCategories = Array.from(
    new Set(events.map((event) => event.category || "Uncategorized"))
  ).filter(Boolean);

  return (
    <div className="transition-all duration-500 ease-in-out overflow-hidden bg-white border-b shadow-sm max-h-[1000px] opacity-100 py-6">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-700">Filter by:</h3>
            <Button
              onClick={clearFilters}
              variant="ghost"
              className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
            >
              <X className="h-4 w-4 mr-1" /> Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <span className="text-gray-500 mr-2">Category:</span>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={locationTypeFilter}
              onValueChange={setLocationTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <span className="text-gray-500 mr-2">Location:</span>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="offline">In-person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-[180px]">
                <span className="text-gray-500 mr-2">Price:</span>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free Events</SelectItem>
                <SelectItem value="paid">Paid Events</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateFilter ? (
                    format(dateFilter, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};