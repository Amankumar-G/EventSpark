"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { slideUp } from "./constants/animations";
import { useEventDetails } from "./hooks/useEventDetails";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyFormFallback } from "./components/EmptyFormFallback";
import { HeaderSection } from "./components/HeaderSection";
import { FormStep } from "./components/FormStep";
import { PaymentStep } from "./components/PaymentStep";


const RegisterPage = () => {
  const { 
    eventName, 
    eventId, 
    eventSlug, 
    jsonStringConfig, 
    ticketTypes, 
    loading 
  } = useEventDetails();
  
  const [formData, setFormData] = useState<any>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setStep(2);
  };

  const handleStartPayment = async (index: number) => {
    try {
      const res = await fetch(`/api/events/${eventId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          ticketTypeIndex: index,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Payment initiation failed");

      setClientSecret(result.clientSecret);
      setSelectedTicketType(index);
    } catch (err) {
      console.error("❌ Payment Intent error:", err);
    }
  };

  const handleBack = () => {
    step === 2 ? setStep(1) : window.history.back();
  };

  if (loading) return <LoadingSkeleton />;
  if (!jsonStringConfig) return <EmptyFormFallback />;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUp}
        className="space-y-8"
      >
        <HeaderSection 
          eventName={eventName} 
          step={step} 
          onBack={handleBack} 
        />

        {step === 1 ? (
          <FormStep 
            jsonStringConfig={jsonStringConfig} 
            onSubmit={handleFormSubmit} 
          />
        ) : (
          <PaymentStep
            eventId={eventId}
            formData={formData}
            ticketTypes={ticketTypes}
            selectedTicketType={selectedTicketType}
            clientSecret={clientSecret}
            eventSlug={eventSlug}
            onSelectTicket={handleStartPayment}
          />
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;