import { Button } from "@/components/ui/button";

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-md">
        <div className="bg-gradient-to-r from-[#FF6B6B] to-[#468FAF] p-1 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#FF6B6B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Error Loading Events
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't load the events. Please try again later.
        </p>
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-[#468FAF] to-[#3a7a99] hover:from-[#3a7a99] hover:to-[#468FAF] text-white"
        >
          Retry
        </Button>
      </div>
    </div>
  );
};