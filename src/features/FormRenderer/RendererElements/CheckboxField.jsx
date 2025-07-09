import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react"; // Using Lucide icons for consistency

const CheckboxField = ({ 
  field, 
  value, 
  handleChange, 
  error, 
  PREFIX = "formalute" 
}) => {
  const excludedKeys = new Set([
    "autocomplete", 
    "spellcheck", 
    "minlength", 
    "maxlength", 
    "classname"
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
      className={`space-y-2 ${PREFIX}-checkbox-container ${field.classname || ""}`}
    >
      <label
        htmlFor={field.id}
        className={`relative flex items-start space-x-3 cursor-pointer group ${PREFIX}-label`}
      >
        {/* Custom checkbox */}
        <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-md transition-all duration-200
          ${error ? "border-[#FF6B6B]" : "border-gray-300 group-hover:border-[#468FAF]"}
          ${value ? "bg-[#468FAF] border-[#468FAF]" : "bg-white"}`}
        >
          {value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </div>
        
        {/* Actual hidden input */}
        <input
          {...filteredField}
          type="checkbox"
          checked={value || false}
          onChange={handleChange}
          className="absolute opacity-0 w-0 h-0"
        />
        
        {/* Label content */}
        <div className="flex flex-col">
          <span className={`text-sm font-medium text-gray-700 ${PREFIX}-label-text`}>
            {field.label}
            {field.required && (
              <span className="text-[#FF6B6B] ml-1">*</span>
            )}
          </span>
          {field.description && (
            <span className={`text-xs text-gray-500 ${PREFIX}-description`}>
              {field.description}
            </span>
          )}
        </div>
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm text-[#FF6B6B] ${PREFIX}-error`}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default CheckboxField;