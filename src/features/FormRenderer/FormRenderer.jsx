"use client"
import React, { useState, useMemo } from "react";
import { Stepper } from "./RendererElements/LeftRightButtons";
import convertAttributesToCamelCase from "./RendererElements/camleCaseUtil";
import InputField from "./RendererElements/InputField";
import TextareaField from "./RendererElements/TextareaField";
import SelectField from "./RendererElements/SelectField";
import CheckboxField from "./RendererElements/CheckboxField";
import MultipleCheckbox from "./RendererElements/MultipleCheckbox";
import MultipleRadio from "./RendererElements/MultipleRadio";
import FileField from "./RendererElements/FileField";
import HiddenField from "./RendererElements/HiddenField";
import HTMLField from "./RendererElements/HTMLField";
import ColorRenderer from "./RendererElements/ColorRenderer";
import RangeRenderer from "./RendererElements/RangeRenderer";
import { FiArrowLeft, FiArrowRight, FiEdit } from 'react-icons/fi';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PREFIX = 'formalute';

const FormRenderer = ({ jsonConfig, onSubmit, action = "#", method = "POST" ,id = "Event"}) => {
  const [errors, setErrors] = useState({});
  const parsedConfig = useMemo(() => {
    try {
      return jsonConfig ? JSON.parse(jsonConfig) : [];
    } catch (err) {
      console.error("Invalid JSON Config:", err);
      return [];
    }
  }, [jsonConfig]);

  const [formData, setFormData] = useState(() =>
    parsedConfig.reduce((acc, partition) => {
      partition.elements.forEach((field) => {
        if (field.name) {
          acc[field.name] = field.value || "";
        }
      });
      return acc;
    }, {})
  );

  const [activePartitionIndex, setActivePartitionIndex] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked, files, options, multiple, dataset } = e.target;
    if (!name) return;
    setFormData((prev) => {
      let updatedValue;
      const inputType = dataset.type || type;

      switch (inputType) {
        case "checkbox":
          updatedValue = !!checked;
          break;
        case "file":
          if (files) {
            let fileArray = Array.from(files);
            
            const field = parsedConfig.flatMap(p => p.elements).find(f => f.name === name);
            if (field && field.sizelimit) {
              const maxSize = field.sizelimit * 1024 * 1024;
              const oversizedFiles = fileArray.filter(file => file.size > maxSize);

              if (oversizedFiles.length > 0) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  [name]: field.errormessagesize || `File size must be under ${field.sizelimit}MB.`,
                }));
                return prev;
              }
            }

            updatedValue = fileArray;
          } else {
            updatedValue = [];
          }
          break;
        case "select-multiple":
          if (multiple && options) {
            updatedValue = Array.from(options)
              .filter((option) => option.selected)
              .map((option) => option.value);
          }
          break;
        case "multiple-checkbox":
          updatedValue = prev[name] ? [...prev[name]] : [];
          if (checked && !updatedValue.includes(value)) {
            updatedValue.push(value);
          } else {
            updatedValue = updatedValue.filter((item) => item !== value);
          }
          break;
        default:
          updatedValue = value;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));

      return {
        ...prev,
        [name]: updatedValue,
      };
    });
  };

  const renderField = (field) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const fieldProps = { field, value, handleChange, error, PREFIX };
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "tel":
      case "url":
      case "number":
      case "date":
        return <InputField {...fieldProps} />;
      case 'color':
        return <ColorRenderer {...fieldProps} />;
      case "textarea":
        return <TextareaField {...fieldProps} />;
      case "select":
        return <SelectField {...fieldProps} />;
      case "checkbox":
        return <CheckboxField {...fieldProps} />;
      case "multiple-checkbox":
        return <MultipleCheckbox {...fieldProps} />;
      case "radio":
        return <MultipleRadio {...fieldProps} />;
      case "file":
        return <FileField {...fieldProps} />;
      case "hidden":
        return <HiddenField {...fieldProps} />;
      case "html":
        return <HTMLField {...fieldProps} />;
      case "range":
        return <RangeRenderer {...fieldProps} />;
      case "divider":
        return <hr className="border-gray-200 my-4" />;
      default:
        console.warn(`Unsupported field type: ${field.type}`);
        return null;
    }
  };

  const validateField = (field, value) => {
    const errors = [];

    if (field.required) {
      if (field.type === 'multiple-checkbox') {
        if (!value || value.length === 0) {
          errors.push(field.errormessage || 'At least one option must be selected.');
        }
      } else if (!value) {
        errors.push(field.errormessage || 'This field is required.');
      }
    }

    if (['number', 'range', 'date'].includes(field.type)) {
      const numValue = Number(value);
      if (field.min != "" && numValue < field.min) {
        errors.push(field.errormessagemin || `Value too short`);
      }
      if (field.max != "" && numValue > field.max) {
        errors.push(field.errormessagemax || `Value too long`);
      }
    }

    if (['text', 'textarea', 'password', 'email', 'tel', 'url'].includes(field.type)) {
      const length = value ? value.length : 0;
      if (field.minlength && length < field.minlength) {
        errors.push(field.errormessageminlength || `Minimum length is ${field.minlength}.`);
      }
      if (field.maxlength && length > field.maxlength) {
        errors.push(field.errormessagemaxlength || `Maximum length is ${field.maxlength}.`);
      }
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        errors.push(field.errormessagepattern || 'Invalid format.');
      }
    }

    if (field.type === 'file' && value.length > 0) {
      if (field.accept) {
        const acceptedTypes = field.accept.split(',').map(t => t.trim());
        const isValidType = value.every(file => 
          acceptedTypes.some(type => 
            type === 'image/*' ? file.type.startsWith('image/') : file.type === type || file.name.endsWith(type)
          )
        );
        if (!isValidType) {
          errors.push(field.errormessageaccept || 'Invalid file type.');
        }
      }
      if (field.sizelimit) {
        const maxSize = field.sizelimit * 1024 * 1024;
        const isValidSize = value.every(file => file.size <= maxSize);
        if (!isValidSize) {
          errors.push(field.errormessagesize || `File size must be under ${field.sizelimit}MB.`);
        }
      }
    }

    return errors.length ? errors.join(' ') : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFields = parsedConfig.flatMap(p => p.elements);
    const newErrors = {};
    allFields.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field, value);
      if (error) newErrors[field.name] = error;
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
    } else {
      if (onSubmit) onSubmit(formData);
      else alert(`Form submitted: ${JSON.stringify(formData, null, 2)}`);
    }
  };

  // Framer Motion variants
  const pageFadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const sectionSlideIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageFadeIn}
      className="bg-gradient-to-b  min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    > 
      <motion.div variants={sectionSlideIn} className="max-w-5xl mx-auto">

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#468FAF]/10 to-[#FF6B6B]/10">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Registration Form for {id}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form
              noValidate
              action={action}
              method={method}
              onSubmit={handleSubmit}
              className="space-y-6"
              >
              {parsedConfig.length > 1 && (
                <Stepper
                  formPartitions={parsedConfig}
                  activePartitionIndex={activePartitionIndex}
                  setActivePartitionIndex={setActivePartitionIndex}
                  PREFIX={PREFIX}
                />
              )}
              {parsedConfig.length > 0 && parsedConfig[activePartitionIndex] ? (
                <div className="space-y-6">
                  {parsedConfig[activePartitionIndex].elements.map((field) => (
                    <motion.div 
                      key={field.id} 
                      variants={sectionSlideIn}
                      className="space-y-2"
                    >
                      {renderField(field)}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No fields to render
                </p>
              )}

              {parsedConfig.length > 1 ? (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  {activePartitionIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActivePartitionIndex(activePartitionIndex - 1)}
                      className="flex items-center gap-2 text-[#468FAF] border-[#468FAF] hover:bg-[#468FAF]/10"
                    >
                      <FiArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}

                  <div className="flex-1 flex justify-center">
                    <div className="flex gap-2">
                      {parsedConfig.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index <= activePartitionIndex ? 'bg-[#468FAF]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {activePartitionIndex < parsedConfig.length - 1 ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const currentPartition = parsedConfig[activePartitionIndex];
                        const newErrors = {};
                        currentPartition.elements.forEach((field) => {
                          const value = formData[field.name];
                          const error = validateField(field, value);
                          if (error) newErrors[field.name] = error;
                        });
                        if (Object.keys(newErrors).length) {
                          setErrors(newErrors);
                        } else {
                          setActivePartitionIndex((prev) =>
                            Math.min(prev + 1, parsedConfig.length - 1)
                          );
                          const updatedErrors = { ...errors };
                          currentPartition.elements.forEach((field) => delete updatedErrors[field.name]);
                          setErrors(updatedErrors);
                        }
                      }}
                      className="flex items-center gap-2 bg-[#468FAF] hover:bg-[#3a7a99] text-white"
                    >
                      Next <FiArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#e55f5f] hover:from-[#e55f5f] hover:to-[#FF6B6B] text-white"
                    >
                      Submit <FiArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-[#FF6B6B] to-[#e55f5f] hover:from-[#e55f5f] hover:to-[#FF6B6B] text-white text-lg font-bold"
                >
                  Submit
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FormRenderer;