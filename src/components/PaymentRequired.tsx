import React from "react";
import { Button } from "../components/ui/button";

const PaymentRequired: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-red-500">Payment required to create a group.</p>
      <Button
        onClick={() => (window.location.href = "/payment")}
        className="mt-4"
      >
        Proceed to Payment
      </Button>
    </div>
  );
};

export default PaymentRequired;
