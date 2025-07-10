import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Search } from "lucide-react";

export const EventSearch = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}) => {
  return (
    <div className="relative max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-4">
      <Search className="absolute left-4 top-1/2 ml-1 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search events by name, location, or category..."
        className="pl-12 pr-4 py-5 text-base md:text-lg bg-white text-gray-800 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-none border-none"
      />

      <Button
        onClick={() => setShowFilters(!showFilters)}
        className="mr-2 absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg px-4 py-2 shadow-none"
      >
        <Filter className="h-5 w-5 mr-2" /> Filters
      </Button>
    </div>
  );
};