import React from "react";
import { FaTrashAlt } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Navigation Buttons
export const LeftButtons = ({ handleNavigatePartition }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute left-4 top-1/2 -translate-y-1/2"
    >
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-[#468FAF] text-[#468FAF] hover:bg-[#468FAF]/10"
        onClick={() => handleNavigatePartition("backward")}
      >
        <FiArrowLeft className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export const RightButtons = ({ handleNavigatePartition }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-[#468FAF] text-[#468FAF] hover:bg-[#468FAF]/10"
        onClick={() => handleNavigatePartition("forward")}
      >
        <FiArrowRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export const AddButton = ({ handleAddPartition }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
        onClick={handleAddPartition}
      >
        <FiPlus className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};


export const Stepper = ({
  formPartitions,
  activePartitionIndex,
  setActivePartitionIndex,
  handleDeletePartition,
  PREFIX,
}) => {
  return (
    <div className="w-full px-4 sm:px-8">
      <ol
        className={`relative flex items-center justify-between w-full ${PREFIX}-stepper`}
      >
        {formPartitions.map((_, index) => (
          <li
            key={index}
            className={`relative flex flex-col items-center flex-1 ${PREFIX}-step-item`}
          >
            {/* Step circle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePartitionIndex(index)}
              className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200
                ${
                  index === activePartitionIndex
                    ? "bg-[#468FAF] border-[#468FAF] text-white shadow-md"
                    : index < activePartitionIndex
                    ? "bg-[#468FAF] border-[#468FAF] text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
            >
              {index + 1}
            </motion.button>

            {/* Horizontal connector line */}
            {index < formPartitions.length - 1 && (
              <div
                className={`absolute top-1/2 left-1/2 h-0.5 w-full transform -translate-y-1/2 ${
                  index < activePartitionIndex ? "bg-[#468FAF]" : "bg-gray-300"
                }`}
              />
            )}

            {/* Delete button */}
            {handleDeletePartition && formPartitions.length > 1 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute -top-2 -right-3 z-20 p-1 bg-[#FF6B6B] text-white rounded-full shadow-sm ${PREFIX}-delete-btn`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePartition(index);
                }}
                aria-label={`Delete Partition ${index + 1}`}
              >
                <FaTrashAlt className="w-3 h-3" />
              </motion.button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
