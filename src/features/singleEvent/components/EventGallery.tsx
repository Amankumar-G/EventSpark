import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const galleryHover = {
  scale: 1.05,
  zIndex: 10,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.3 },
};

export const EventGallery = ({ speakerImages }: { speakerImages: string[] }) => (
  <Card className="border-0 shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#FF6B6B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Event Gallery
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {speakerImages.map((imgSrc, index) => (
          <motion.div
            key={index}
            whileHover={galleryHover}
            className="relative rounded-xl overflow-hidden aspect-square shadow-md"
          >
            <Image
              src={imgSrc}
              alt={`Gallery image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);