import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TicketSelection } from "./TicketSelection";
import { PaymentForm } from "./PaymentForm";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";

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
}

export const PaymentStep = ({
  eventId,
  formData,
  ticketTypes,
  selectedTicketType,
  clientSecret,
  eventSlug,
  onSelectTicket,
}: PaymentStepProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <TicketSelection
      ticketTypes={ticketTypes}
      selectedTicketType={selectedTicketType}
      onSelectTicket={onSelectTicket}
    />

    <div className="space-y-8">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            eventId={eventId}
            formData={formData}
            selectedTicketType={selectedTicketType}
            eventSlug={eventSlug}
          />
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
  </div>
);