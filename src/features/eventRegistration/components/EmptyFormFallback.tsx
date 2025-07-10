import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { fadeIn } from "../constants/animations";

export const EmptyFormFallback = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="container mx-auto max-w-xl px-4 py-12 text-center"
  >
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-red-100 p-4 rounded-full">
        <AlertTriangle className="text-red-500 h-10 w-10" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Form Not Available
      </h2>
      <p className="text-gray-600">
        No valid form configuration found for this event.
      </p>
    </div>
  </motion.div>
);