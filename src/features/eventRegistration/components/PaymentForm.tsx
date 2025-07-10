import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface PaymentFormProps {
  eventId: string;
  formData: any;
  selectedTicketType: number | null;
  eventSlug: string;
}

export const PaymentForm = ({ eventId, formData, selectedTicketType, eventSlug }: PaymentFormProps) => {
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