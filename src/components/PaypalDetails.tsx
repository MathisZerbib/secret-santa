// PayPalDetails.tsx
import React from "react";
import { Button } from "../components/ui/button";

export const PayPalDetails: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        You will be redirected to PayPal to complete your payment securely.
      </p>
      <Button
        type="button"
        className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
        onClick={() => {
          // Here you would typically initiate the PayPal payment process
          console.log("Initiating PayPal payment");
        }}
      >
        Pay with PayPal
      </Button>
    </div>
  );
};
