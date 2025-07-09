import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react"; // Using Lucide icons for consistency

const MultipleCheckbox = ({
  field,
  value = [],
  handleChange,
  error,
  PREFIX = "formalute",
}) => {
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
      className={`space-y-3 ${PREFIX}-checkbox-group ${field.classname || ""}`}
    >
      {field.label && (
        <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${PREFIX}-label`}>
          {field.label}
          {field.required && (
            <span className="text-[#FF6B6B]">*</span>
          )}
        </label>
      )}

      <div className="space-y-2">
        {field.options.map((option) => (
          <motion.div 
            key={option.value}
            whileHover={{ scale: 1.01 }}
            className="flex items-center"
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id={`${field.id}-${option.value}`}
                name={field.name}
                value={option.value}
                checked={value.includes(option.value)}
                onChange={handleChange}
                data-type="multiple-checkbox"
                className="absolute opacity-0 w-0 h-0"
                required={field.required}
              />
              <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-md mr-3 transition-all
                ${value.includes(option.value) ? 
                  'bg-[#468FAF] border-[#468FAF]' : 
                  'bg-white border-gray-300 hover:border-[#468FAF]'}
                ${error ? 'border-[#FF6B6B]' : ''}`}
              >
                {value.includes(option.value) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
            <label
              htmlFor={`${field.id}-${option.value}`}
              className={`text-sm text-gray-700 cursor-pointer ${PREFIX}-option-label`}
            >
              {option.text}
            </label>
          </motion.div>
        ))}
      </div>

      {field.description && (
        <p className={`text-xs text-gray-500 ${PREFIX}-description`}>
          {field.description}
        </p>
      )}

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

export default MultipleCheckbox;

