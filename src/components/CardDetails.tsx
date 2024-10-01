// CardDetails.tsx
import React from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const CardDetails: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" placeholder="MM/YY" required />
        </div>
        <div className="flex-1">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" placeholder="123" required />
        </div>
      </div>
    </div>
  );
};
