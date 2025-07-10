import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const EventTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <div className="overflow-x-auto">
        <TabsList className="inline-flex gap-4 bg-transparent w-full">
          {["all", "active", "upcoming", "past"].map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="relative flex-1 pb-2 text-sm md:text-base text-gray-800 font-medium transition-colors
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
                after:bg-orange-500 after:transition-all after:duration-300
                data-[state=active]:after:w-full data-[state=active]:text-black"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};