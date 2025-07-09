import React from "react";
import { motion } from "framer-motion";

const HTMLField = ({ field, PREFIX = "formalute" }) => {
  if (!field) return null;

  const {
    color,
    italic,
    bold,
    fontSize,
    textAlign,
    classname,
    label,
    tag = "p",
    description,
  } = field;

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

  // Base style with fallbacks
  const baseStyle = {
    color: color || "inherit",
    fontStyle: italic ? "italic" : "normal",
    fontWeight: bold ? "bold" : "normal",
    fontSize: fontSize ? `${fontSize}px` : undefined,
    textAlign: textAlign || "left",
  };

  // Text classes based on tag with proper hierarchy
  const textClasses = {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-medium",
    h4: "text-lg font-medium",
    p: "text-base leading-relaxed",
    div: "text-base"
  };

  const textClass = textClasses[tag] || textClasses.p;

  // Render the appropriate HTML element
  const renderElement = (Tag) => (
    <Tag 
      style={baseStyle}
      className={`${textClass} ${PREFIX}-html-text text-gray-800`}
    >
      {label}
    </Tag>
  );

  return (
    <motion.div 
      variants={fieldVariants}
      className={`mb-6 ${PREFIX}-html-container ${classname || ""}`}
    >
      {tag === "h1" && renderElement("h1")}
      {tag === "h2" && renderElement("h2")}
      {tag === "h3" && renderElement("h3")}
      {tag === "h4" && renderElement("h4")}
      {tag === "p" && renderElement("p")}
      {(!tag || tag === "div") && renderElement("div")}

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-2 text-sm text-gray-500 ${PREFIX}-html-description`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default HTMLField;