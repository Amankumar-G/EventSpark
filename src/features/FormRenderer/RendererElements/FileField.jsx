import React from "react";
import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react"; // Using Lucide icons for consistency

const FileField = ({ 
  field, 
  value = [], 
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

  const isMultiple = field.multiple === true;

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

  const handleRemoveFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    handleChange({ target: { name: field.name, value: newFiles } });
  };

  return (
    <motion.div 
      variants={fieldVariants}
      className={`space-y-3 ${PREFIX}-file-container ${field.classname || ""}`}
    >
      {field.label && (
        <label
          htmlFor={field.id}
          className={`flex items-center gap-2 text-sm font-medium text-gray-700 ${PREFIX}-label`}
        >
          <Upload className="w-4 h-4 text-[#468FAF]" />
          {field.label}
          {field.required && (
            <span className="text-[#FF6B6B] ml-1">*</span>
          )}
        </label>
      )}

      <div className={`relative border-2 border-dashed ${
        error ? "border-[#FF6B6B]" : "border-gray-300 hover:border-[#468FAF]"
      } rounded-xl p-6 transition-all duration-300`}>
        <input
          {...filteredField}
          multiple={isMultiple}
          onChange={handleChange}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-[#468FAF]">Click to upload</span> or drag and drop
            </p>
            {field.accept && (
              <p className="text-xs text-gray-500">
                {isMultiple ? 'Files' : 'File'} accepted: {field.accept.split(',').join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 space-y-2"
        >
          <p className="text-sm font-medium text-gray-700">
            Selected {isMultiple ? 'Files' : 'File'}:
          </p>
          <ul className="space-y-2">
            {value.map((file, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <File className="w-4 h-4 text-[#468FAF]" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-gray-400 hover:text-[#FF6B6B] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
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

      {field.description && (
        <p className={`text-xs text-gray-500 ${PREFIX}-description`}>
          {field.description}
        </p>
      )}
    </motion.div>
  );
};

export default FileField;