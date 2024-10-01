import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";

import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import "../app/globals.css"; // Ensure you have the necessary global styles
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CardDetails } from "../components/CardDetails";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const PersonalInfoForm: React.FC<{
  onNext: () => void;
}> = ({ onNext }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nom complet</Label>
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
      </div>
      <Button
        type="submit"
        className="w-full flex items-center justify-center shadow-lg"
      >
        Continuer vers le paiement <ChevronRightIcon className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
};

const PaymentForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setMessage(error.message || "Une erreur inattendue s'est produite.");
    } else {
      setMessage("Paiement réussi!");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardDetails />
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center text-white"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" /> Retour
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          className="flex items-center shadow-md bg-white bg-opacity-20 text-white hover:bg-opacity-30"
        >
          {isProcessing ? "Traitement..." : "Payer 10$ / an"}
        </Button>
      </div>
      {message && (
        <div
          className={`mt-4 p-2 rounded ${
            message.includes("réussi")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<"personal" | "payment">("personal");
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // Create Payment Intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // 10$ par an
      });

      if (!response.ok) {
        throw new Error(
          "Une erreur s'est produite lors de la création du paiement."
        );
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      console.log("Client Secret:", data.clientSecret); // Debugging step
      setStep("payment");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Une erreur inconnue s'est produite.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Shader Gradient Background */}
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Ensure the gradient stays in the background
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
        />
      </ShaderGradientCanvas>

      {/* Glassmorphism Card */}
      <Card className="m-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 glassmorphism-card shadow-xl backdrop-blur-lg bg-opacity-30 bg-white">
        {/* Left Section: Intro & Highlights */}
        <motion.div
          className="p-6 bg-opacity-10 backdrop-blur-md text-white flex flex-col justify-center space-y-6"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Abonnement annuel Secret Santa
          </h2>
          <p className="mb-6 text-lg">
            Profitez de notre service Secret Santa pour seulement 10$ par an !
          </p>
          <ul className="space-y-4">
            {[
              "Appariement de cadeaux personnalisé",
              "Traitement sécurisé des paiements",
              "Plateforme simple et intuitive",
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <ChevronRightIcon className="w-4 h-4" /> <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right Section: Forms */}
        <div className="p-6 bg-white bg-opacity-10 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {step === "personal"
                ? "Informations personnelles"
                : "Terminez le paiement"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Chargement...</p>
            ) : step === "personal" ? (
              <PersonalInfoForm onNext={handleNext} />
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm onBack={() => setStep("personal")} />
              </Elements>
            ) : (
              <p>Erreur lors de la création du paiement. Veuillez réessayer.</p>
            )}
            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            <p className="text-sm text-white">
              {step === "personal" ? "Étape 1 sur 2" : "Étape 2 sur 2"}
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutPage;
