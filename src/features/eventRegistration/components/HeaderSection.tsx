import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderSectionProps {
  eventName: string;
  step: 1 | 2;
  onBack: () => void;
}

export const HeaderSection = ({ eventName, step, onBack }: HeaderSectionProps) => (
  <div className="space-y-8">
    <Button
      variant="ghost"
      className="text-[#468FAF] hover:bg-[#468FAF]/10"
      onClick={onBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to {step === 2 ? "Form" : "Events"}
    </Button>

    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4 mb-8"
    >
      <div className="inline-flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] bg-clip-text text-transparent">
          {eventName}
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] rounded-full mt-2" />
      </div>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {step === 1
          ? "Complete your registration below to secure your spot"
          : "Choose your preferred ticket and finalize payment"}
      </p>

      {step === 2 && (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="px-4 py-1 border-[#468FAF] text-[#468FAF]"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Registration Details Complete
          </Badge>
        </div>
      )}
    </motion.div>
  </div>
);