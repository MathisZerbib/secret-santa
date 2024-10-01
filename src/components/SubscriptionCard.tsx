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
        throw new Error("Failed to create checkout session");
      }

      const { session: checkoutSession } = await res.json();

      if (!checkoutSession || !checkoutSession.id) {
        throw new Error("Invalid checkout session");
      }

      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div
      onClick={() => handleCreateCheckoutSession(priceId)}
      className="p-10 border-2 hover:cursor-pointer hover:bg-gray-700 hover:scale-105 duration-300 transition-all w-full max-w-[21rem] min-h-[22rem] bg-black"
    >
      <div className="font-bold text-3xl mb-2 capitalize">{planType}</div>
      <div className="flex items-baseline mb-2">
        <div className="text-3xl mr-2">{price}</div> / Month
      </div>
      <ul className="list-disc pl-4">
        <li>Appointment scheduling</li>
        <li>Patient notification</li>
        <li>Create up to one office</li>
        <li>Description ...</li>
        <li>Description ....</li>
      </ul>
    </div>
  );
};

export default SubscriptionCard;
