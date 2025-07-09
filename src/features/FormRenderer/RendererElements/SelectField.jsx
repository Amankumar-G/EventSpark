import React from "react";
import { motion } from "framer-motion";

const SelectField = ({
  field,
  value,
  handleChange,
  error,
  PREFIX = "formalute",
}) => {
  const isMultiple = field.multiple;
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

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  return (
    <motion.div
      variants={fieldVariants}
      className={`space-y-2 ${field.classname || ""}`}
    >
      {field.label && (
        <label
          htmlFor={field.id}
          className={`block text-sm font-medium text-gray-700 ${PREFIX}-label`}
        >
          {field.label}
          {field.required && (
            <span className="text-[#FF6B6B] ml-1">*</span>
          )}
        </label>
      )}

      <select
        {...filteredField}
        multiple={isMultiple}
        value={value || (isMultiple ? [] : "")}
        onChange={handleChange}
        className={`w-full px-4 py-3 border ${
          error ? "border-[#FF6B6B]" : "border-gray-300 hover:border-[#468FAF]"
        } rounded-xl shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#468FAF]/50 focus:border-[#468FAF] transition-all duration-300 ${PREFIX}-select`}
      >
        {field.options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 bg-white hover:bg-[#f1f5f9] px-2 py-1"
          >
            {option.text}
          </option>
        ))}
      </select>

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

export default SelectField;
