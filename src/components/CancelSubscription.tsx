// components/CancelSubscription.tsx
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
      console.log(subscription);

      toast({
        title: "Succès",
        description: "Votre abonnement a été annulé avec succès.",
      });

      // Redirect to subscription page or dashboard
      router.push("/subscription");
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Annuler l&apos;abonnement
      </h2>
      <p className="mb-6 text-gray-600">
        Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action mettra
        fin à votre accès aux fonctionnalités premium à la fin de votre période
        de facturation actuelle.
      </p>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => router.back()}
          className="bg-gray-300 text-black hover:bg-gray-400"
        >
          Retour
        </Button>
        <Button
          onClick={handleCancelSubscription}
          className="bg-red-500 text-white hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? "Annulation en cours..." : "Confirmer l'annulation"}
        </Button>
      </div>
    </div>
  );
};

export default CancelSubscription;
