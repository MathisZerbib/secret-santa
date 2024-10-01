import getStripe from "@/utils/get-stripejs";

export const SubscriptionCard = ({
  planType,
  price,
  priceId,
}: {
  planType: string;
  price: string;
  priceId: string;
}) => {
  const handleCreateCheckoutSession = async (priceId: string) => {
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        body: JSON.stringify({ priceId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Échec de la création de la session de paiement");
      }

      const { session: checkoutSession } = await res.json();

      if (!checkoutSession || !checkoutSession.id) {
        throw new Error("Session de paiement invalide");
      }

      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        console.error("Erreur de paiement Stripe :", error);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de paiement :",
        error
      );
    }
  };

  const getFeatures = (planType: string) => {
    switch (planType) {
      case "Basic":
        return [
          "Organiser jusqu'à 1 événement Secret Santa",
          "Envoyer des messages anonymes",
          "Gérer jusqu'à 10 participants",
          "Définir des budgets cadeaux",
        ];
      case "Standard":
        return [
          "Organiser jusqu'à 5 événements Secret Santa",
          "Envoyer des messages anonymes",
          "Gérer jusqu'à 50 participants",
          "Définir des budgets cadeaux",
          "Tirage au sort automatique des paires Secret Santa",
        ];
      case "Premium":
        return [
          "Événements Secret Santa illimités",
          "Envoyer des messages anonymes",
          "Gérer un nombre illimité de participants",
          "Définir des budgets cadeaux",
          "Tirage au sort automatique des paires Secret Santa",
          "Support prioritaire",
        ];
      default:
        return [];
    }
  };

  const features = getFeatures(planType);

  return (
    <div
      onClick={() => handleCreateCheckoutSession(priceId)}
      className="p-4 md:p-6 lg:p-8 border-2 border-white border-opacity-20 rounded-lg backdrop-blur-md bg-white bg-opacity-10 hover:cursor-pointer hover:bg-opacity-20 hover:scale-105 duration-300 transition-all w-full max-w-[20rem] min-h-[20rem] mx-auto mb-8"
    >
      <div className="font-bold text-2xl md:text-3xl mb-2 capitalize text-white">
        {planType}
      </div>
      <div className="flex items-baseline mb-2">
        <div className="text-2xl md:text-3xl mr-2 text-white">{price}</div>
        <span className="text-lg md:text-xl text-white">/ Mois</span>
      </div>
      <ul className="list-disc pl-4 text-white space-y-1">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionCard;
