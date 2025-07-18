import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const EventDetailsCard = ({ description }: { description: string }) => (
  <Card className="border-0 shadow-sm rounded-2xl">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#468FAF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        Event Details
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="prose prose-lg max-w-none text-gray-700">
        {description}
      </div>
    </CardContent>
  </Card>
);