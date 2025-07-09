import React from "react";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react"; // Using Lucide icon for consistency

const RangeRenderer = ({
  field,
  value = field.min || 0,
  handleChange,
  error,
  PREFIX = "formalute",
}) => {
  const excludedKeys = new Set([
    "autocomplete",
    "spellcheck",
    "minlength",
    "maxlength",
    "classname",
  ]);

  const filteredField = Object.fromEntries(
    Object.entries(field).filter(
      ([key, val]) =>
        val !== "" &&
        val !== null &&
        val !== undefined &&
        !excludedKeys.has(key)
    )
  );

  // Calculate progress percentage for gradient
  const progress = ((value - (field.min || 0)) / ((field.max || 100) - (field.min || 0)) * 100);

  // Animation variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  };

  return (
    <motion.div 
      variants={fieldVariants}
      className={`space-y-4 ${PREFIX}-range-container ${field.classname || ""}`}
    >
      {field.label && (
        <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${PREFIX}-label`}>
          <Gauge className="w-4 h-4 text-[#468FAF]" />
          {field.label}
          {field.required && (
            <span className="text-[#FF6B6B]">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          {...filteredField}
          type="range"
          value={value}
          onChange={handleChange}
          className={`w-full h-2 appearance-none rounded-full cursor-pointer focus:outline-none ${
            error ? "border-[#FF6B6B]" : ""
          }`}
          style={{
            background: `linear-gradient(to right, #468FAF 0%, #468FAF ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
          }}
        />
        <div className="absolute -bottom-1 w-full h-1 rounded-full bg-gray-200 -z-10"></div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-700">
        <span>{field.min || 0}</span>
        <motion.span 
          className="font-medium text-[#468FAF] px-3 py-1 bg-[#468FAF]/10 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          Current: {value}
        </motion.span>
        <span>{field.max || 100}</span>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm text-[#FF6B6B] ${PREFIX}-error`}
        >
          {error}
        </motion.p>
      )}

      {field.description && (
        <p className={`text-xs text-gray-500 ${PREFIX}-description`}>
          {field.description}
        </p>
      )}
    </motion.div>
  );
};

export default RangeRenderer;