"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import FormRenderer from "@/features/FormRenderer/FormRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowLeft, Ticket, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const RegisterPage = () => {
  const params = useParams();
  const id = params.id;

  const [jsonStringConfig, setJsonStringConfig] = useState("");
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [formData, setFormData] = useState<any>(null);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<number | null>(
    null
  );
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        const event = data.event;
        setEventName(event.title);
        setEventId(event._id);
        setEventSlug(event.slug)

        // Filter only active tickets
        const activeTickets = (event.ticketTypes || []).filter(
          (ticket: any) => ticket.isActive
        );
        setTicketTypes(activeTickets);

        if (event?.formConfig) {
          let finalConfig = event.formConfig;
          if (typeof finalConfig === "string")
            finalConfig = JSON.parse(finalConfig);
          setJsonStringConfig(JSON.stringify(finalConfig, null, 4));
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!jsonStringConfig) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto max-w-xl px-4 py-12 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-500 h-10 w-10" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Form Not Available
          </h2>
          <p className="text-gray-600">
            No valid form configuration found for this event.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideUp}
        className="space-y-8"
      >
        <Button
          variant="ghost"
          className="text-[#468FAF] hover:bg-[#468FAF]/10"
          onClick={() => (step === 2 ? setStep(1) : window.history.back())}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {step === 2 ? "Form" : "Events"}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] bg-clip-text text-transparent">
              {eventName}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-[#468FAF] to-[#FF6B6B] rounded-full mt-2" />
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {step === 1
              ? "Complete your registration below to secure your spot"
              : "Choose your preferred ticket and finalize payment"}
          </p>

          {step === 2 && (
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="px-4 py-1 border-[#468FAF] text-[#468FAF]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Registration Details Complete
              </Badge>
            </div>
          )}
        </motion.div>

        {step === 1 && (
          <motion.div variants={fadeIn}>
            <FormRenderer
              jsonConfig={jsonStringConfig}
              onSubmit={handleFormSubmit}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Ticket Selection */}
            <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#FF6B6B] to-[#e55f5f] p-6 text-white">
                <CardTitle>Available Tickets</CardTitle>
                <CardDescription className="text-white/90">
                  {ticketTypes.length} options available
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {ticketTypes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No active tickets available for this event
                  </div>
                ) : (
                  ticketTypes.map((ticket, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Card
                        className={`border overflow-hidden transition-all ${
                          selectedTicketType === index
                            ? "border-[#468FAF] ring-2 ring-[#468FAF]/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Ticket className="h-5 w-5 text-[#FF6B6B]" />
                                <h3 className="text-lg font-semibold">
                                  {ticket.name}
                                </h3>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {ticket.sold} sold
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                ₹{ticket.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <Button
                            onClick={() => handleStartPayment(index)}
                            disabled={
                              selectedTicketType === index &&
                              clientSecret !== ""
                            }
                            className="w-full"
                            variant={
                              selectedTicketType === index
                                ? "default"
                                : "outline"
                            }
                          >
                            {selectedTicketType === index && clientSecret !== ""
                              ? "Selected"
                              : "Select Ticket"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-8">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm eventId={eventId} formData={formData} selectedTicketType={selectedTicketType} eventSlug={eventSlug} />
                </Elements>
              ) : (
                <Card className="border-0 shadow-sm rounded-xl overflow-hidden h-full flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Ticket className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Select a ticket to proceed
                    </h3>
                    <p className="text-gray-500">
                      Choose from the available ticket options on the left
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

interface PaymentFormProps {
  eventId: string;
  formData: any;
  selectedTicketType: number | null;
  eventSlug:string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ eventId, formData, selectedTicketType ,eventSlug}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  if (!formData || selectedTicketType === null) {
    setMessage("⚠️ Something went wrong. Please try again.");
    return;
  }

  setIsLoading(true);

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/events/success`,
    },
    redirect: "if_required",
  });

  if (error) {
    setMessage(error.message || "Payment failed");
    setIsLoading(false);
    return;
  }

  if (paymentIntent?.status === "succeeded") {
    setMessage("✅ Payment successful!");

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ticketTypeIndex: selectedTicketType,
        }),
      });

      if (res.ok) {
        window.location.href = `/events/${eventSlug}?success=true`;
        return;
      } else {
        const err = await res.json();
        setMessage(`⚠️ Registration failed: ${err.error}`);
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong while saving registration.");
    }
  }

  setIsLoading(false);
};


  return (
    <Card className="border-0 shadow-sm rounded-xl overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] p-6 text-white">
        <CardTitle>Payment Details</CardTitle>
        <CardDescription className="text-white/90">
          Complete your purchase securely
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button
            type="submit"
            disabled={isLoading || !stripe}
            className="w-full py-6 text-lg font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </Button>
          {message && (
            <div
              className={`text-center p-3 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
