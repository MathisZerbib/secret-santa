import React, { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const CancelSubscription: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/subscription-cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to cancel subscription");
      }

      const { subscription } = await res.json();
      console.log("subscription : " + JSON.stringify(subscription).toString());

      toast({
        title: "Succès",
        description: "Votre abonnement a été annulé avec succès.",
      });

      // Redirect to app page or dashboard
      router.push("/app");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description:
          "Échec lors de l'annulation de l'abonnement. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCancelSubscription}
      className="bg-red-500 text-white hover:bg-red-600"
      disabled={isLoading}
    >
      {isLoading ? "Annulation en cours..." : "Annuler mon abonement"}
    </Button>
  );
};

export default CancelSubscription;
