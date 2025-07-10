import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <Card className="bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] text-white border-0 rounded-2xl overflow-hidden">
        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="opacity-90 max-w-md">
              Create your own event and share it with thousands of potential
              attendees.
            </p>
          </div>
          <Button className="bg-white text-[#FF6B6B] hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-xl">
            Create an Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};