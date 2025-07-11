import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TicketSelection } from "./TicketSelection";
import { PaymentForm } from "./PaymentForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Ticket, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
interface PaymentStepProps {
  eventId: string;
  formData: any;
  ticketTypes: any[];
  selectedTicketType: string | null;
  clientSecret: string;
  eventSlug: string;
  onSelectTicket: (index: string) => void;
  loadingTicket: boolean; // 🆕
}

export const PaymentStep = ({
  eventId,
  formData,
  ticketTypes,
  selectedTicketType,
  clientSecret,
  eventSlug,
  onSelectTicket,
  loadingTicket,
}: PaymentStepProps) => {
  const selectedTicket = ticketTypes.find(
    (ticket) => ticket._id === selectedTicketType
  );

  const isFreeTicket = selectedTicket && selectedTicket.price === 0;
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFreeTicketSubmit = async () => {
    setIsSubmitting(true); // start loading
    setMessage("");

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ticketTypeId: selectedTicketType,
          paymentIntentId: "free",
          paymentStatus: "succeeded",
        }),
      });

      if (res.ok) {
        const result = await res.json();
        window.location.href = `/events/${eventSlug}?success=true&registrationId=${
          result.registrationId || ""
        }`;
      } else {
        const err = await res.json();
        setMessage(
          `⚠️ Registration failed: ${err.error || "Unknown error occurred"}`
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage(
        "⚠️ Payment successful but registration failed. Please contact support."
      );
    } finally {
      setIsSubmitting(false); // end loading
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TicketSelection
        ticketTypes={ticketTypes}
        selectedTicketType={selectedTicketType}
        onSelectTicket={onSelectTicket}
        loadingTicket={loadingTicket} // 🆕
      />

      <div className="space-y-6">
        {selectedTicketType ? (
          isFreeTicket ? (
            <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#48BB78] to-[#38A169] p-6 text-white">
                <CardTitle>Free Registration</CardTitle>
                <CardDescription className="text-white/90">
                  No payment required
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100/20 p-4 rounded-full mb-4 border-4 border-green-100/30">
                    <CheckCircle className="h-8 w-8 text-green-100" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    You're almost there!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    This event is completely free. Just confirm your
                    registration below.
                  </p>
                  <Badge
                    variant="outline"
                    className="text-green-800 bg-green-100 border-green-200"
                  >
                    Free Admission
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={handleFreeTicketSubmit}
                  className="w-full bg-gradient-to-r from-[#48BB78] to-[#38A169] hover:from-[#38A169] hover:to-[#2F855A] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Confirming..." : "Confirm Registration"}
                </Button>
              </CardFooter>
            </Card>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                eventId={eventId}
                formData={formData}
                selectedTicketType={selectedTicketType}
                eventSlug={eventSlug}
              />
            </Elements>
          ) : (
            <EmptyTicketState />
          )
        ) : (
          <EmptyTicketState />
        )}
      </div>
    </div>
  );
};

const EmptyTicketState = () => (
  <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
    <CardContent className="p-6 text-center">
      <div className="bg-muted p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <Ticket className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Select a ticket</h3>
      <p className="text-muted-foreground">
        Choose from the available options to proceed
      </p>
    </CardContent>
  </Card>
);
