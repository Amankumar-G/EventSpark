import React from "react";
import { motion } from "framer-motion";
import { Palette } from "lucide-react"; // Using Lucide icon for consistency

const ColorRenderer = ({ 
  field, 
  value = "#000000", 
  handleChange, 
  error, 
  PREFIX = "formalute" 
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
      className={`space-y-3 ${PREFIX}-color-container ${field.classname || ""}`}
    >
      {field.label && (
        <label
          htmlFor={field.id}
          className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${PREFIX}-label`}
        >
          <Palette className="w-4 h-4 text-[#468FAF]" />
          {field.label}
          {field.required && (
            <span className="text-[#FF6B6B] ml-1">*</span>
          )}
        </label>
      )}

      <div className="flex items-center gap-4">
        {/* Custom-styled color input */}
        <div className={`relative w-12 h-12 rounded-xl border-2 ${
          error ? "border-[#FF6B6B]" : "border-gray-200 hover:border-[#468FAF]"
        } transition-all duration-300 overflow-hidden shadow-sm`}>
          <input
            {...filteredField}
            value={value}
            onChange={handleChange}
            type="color"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className="w-full h-full"
            style={{ backgroundColor: value }}
          />
        </div>

        {/* Color value display */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
            {value.toUpperCase()}
          </span>
          {value && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handleChange({ target: { name: field.name, value: "#000000" }})}
              className="text-xs text-gray-500 hover:text-[#FF6B6B] transition-colors"
            >
              Reset
            </motion.button>
          )}
        </div>
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

export default ColorRenderer;