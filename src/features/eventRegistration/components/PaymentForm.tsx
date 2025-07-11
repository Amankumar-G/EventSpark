import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";

interface PaymentFormProps {
  eventId: string;
  formData: any;
  selectedTicketType: string | null;
  eventSlug: string;
}

export const PaymentForm = ({ eventId, formData, selectedTicketType, eventSlug }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Stripe.js hasn't yet loaded
    if (!stripe || !elements) {
      setMessage("⚠️ Payment system is loading. Please wait and try again.");
      return;
    }

    // Validate form data
    if (!formData || selectedTicketType === null) {
      setMessage("⚠️ Please complete all required fields before proceeding.");
      return;
    }

    setIsLoading(true);
    setMessage(""); // Clear previous messages

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      setIsLoading(false);
      return;
    }

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/events/success?eventSlug=${eventSlug}`,
        // Add receipt email if available in formData
        receipt_email: formData.email || undefined,
      },
      redirect: "if_required",
    });

    if (error) {
      handleError(error);
      setIsLoading(false);
      return;
    }

    // Handle successful payment
    if (paymentIntent?.status === "succeeded") {
      setMessage("✅ Payment successful! Processing your registration...");
      
      try {
        const res = await fetch(`/api/events/${eventId}/register`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            ticketTypeId: selectedTicketType,
            paymentIntentId: paymentIntent.id, // Include payment intent ID
            paymentStatus: paymentIntent.status,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          // Redirect to success page with registration details
          window.location.href = `/events/${eventSlug}?success=true&registrationId=${result.registrationId || ''}`;
          return;
        } else {
          const err = await res.json();
          setMessage(`⚠️ Registration failed: ${err.error || 'Unknown error occurred'}`);
        }
      } catch (err) {
        console.error('Registration error:', err);
        setMessage("⚠️ Payment successful but registration failed. Please contact support.");
      }
    } else if (paymentIntent?.status === "processing") {
      setMessage("⏳ Payment is processing. You'll receive a confirmation email shortly.");
    } else if (paymentIntent?.status === "requires_payment_method") {
      setMessage("⚠️ Payment was not successful. Please try a different payment method.");
    } else {
      setMessage("⚠️ Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  const handleError = (error: StripeError) => {
    console.error('Payment error:', error);
    
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(`⚠️ ${error.message}`);
    } else if (error.type === "invalid_request_error") {
      setMessage("⚠️ Invalid request. Please check your payment details.");
    } else {
      setMessage("⚠️ An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-xl overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] p-6 text-white">
        <CardTitle>Payment Details</CardTitle>
        <CardDescription className="text-white/90">
          Complete your purchase securely with Stripe
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement 
            options={{
              layout: "tabs",
              // Enable additional payment methods
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              // Pre-fill billing details
              defaultValues: {
                billingDetails: {
                  name: formData?.name || '',
                  email: formData?.email || '',
                  phone: formData?.phone || '',
                }
              }
            }}
          />
          
          <Button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="w-full py-6 text-lg font-medium bg-[#468FAF] hover:bg-[#3a7a99] disabled:opacity-50 disabled:cursor-not-allowed"
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
                Processing Payment...
              </span>
            ) : (
              "Pay Now"
            )}
          </Button>
          
          {message && (
            <div
              className={`text-center p-3 rounded-lg border ${
                message.includes("✅")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : message.includes("⏳")
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-red-50 text-red-700 border-red-200"
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