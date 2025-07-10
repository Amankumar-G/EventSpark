import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Globe } from "lucide-react";
import {IEventLocation} from "@/models/Event"

export const EventLocation = ({ location }: { location: IEventLocation }) => (
  <Card className="border-0 shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <MapPin className="h-6 w-6 text-[#468FAF]" />
        Location
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-gray-100 p-3 rounded-lg">
            {location.type === "offline" ? (
              <MapPin className="h-6 w-6 text-[#FF6B6B]" />
            ) : (
              <Globe className="h-6 w-6 text-[#468FAF]" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-lg text-gray-800">
              {location.type === "offline" ? "In-Person Event" : "Online Event"}
            </h3>
            <p className="text-gray-600 mt-1">{location.address}</p>
          </div>
        </div>

        {location.type === "offline" ? (
          <OfflineLocation location={location} />
        ) : (
          <OnlineLocation />
        )}
      </div>
    </CardContent>
  </Card>
);

const OfflineLocation = ({ location }: { location: IEventLocation }) => (
  <>
    <div className="rounded-xl overflow-hidden w-full h-64 border-2 border-gray-200">
      <iframe
        src={`https://maps.google.com/maps?q=${encodeURIComponent(
          location.address
        )}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        className="rounded-xl"
      />
    </div>
    <div className="flex gap-3">
      <Button
        asChild
        variant="outline"
        className="text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B]/10"
      >
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            location.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin className="h-4 w-4 mr-2" />
          View on Google Maps
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        className="text-[#468FAF] border-[#468FAF] hover:bg-[#468FAF]/10"
      >
        <Link
          href={`https://maps.apple.com/?q=${encodeURIComponent(
            location.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin className="h-4 w-4 mr-2" />
          View on Apple Maps
        </Link>
      </Button>
    </div>
  </>
);

const OnlineLocation = () => (
  <div className="bg-gradient-to-r from-[#468FAF]/10 to-[#FF6B6B]/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between">
    <div>
      <h3 className="font-medium text-lg text-gray-800">Online Access</h3>
      <p className="text-gray-600 mt-1">
        Link will be provided after registration
      </p>
    </div>
    <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white">
      <Globe className="h-4 w-4 mr-2" /> Join Online
    </Button>
  </div>
);