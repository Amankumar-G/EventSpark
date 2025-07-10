import { motion } from "framer-motion";
import { fadeIn } from "../constants/animations";
import FormRenderer from "@/features/FormRenderer/FormRenderer";

interface FormStepProps {
  jsonStringConfig: string;
  onSubmit: (data: any) => void;
}

export const FormStep = ({ jsonStringConfig, onSubmit }: FormStepProps) => (
  <motion.div variants={fadeIn}>
    <FormRenderer
      jsonConfig={jsonStringConfig}
      onSubmit={onSubmit}
    />
  </motion.div>
);