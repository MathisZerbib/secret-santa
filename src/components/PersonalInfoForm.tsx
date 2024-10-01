import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { CardDetails } from "./CardDetails";
import { PayPalDetails } from "./PaypalDetails";

const PersonalInfoForm: React.FC<{
  onNext: (paymentMethod: string) => void;
}> = ({ onNext }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext(paymentMethod);
      }}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>
        </div>

        <AnimatePresence mode="wait">
          {paymentMethod === "card" && (
            <motion.div
              key="card"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardDetails />
            </motion.div>
          )}
          {paymentMethod === "paypal" && (
            <motion.div
              key="paypal"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PayPalDetails />
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
