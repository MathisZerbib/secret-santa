import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Stripe from "stripe";
import Loader from "@/components/ui/loader";

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      fetchCheckoutSession(session_id as string);
    }
  }, [session_id]);

  const fetchCheckoutSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/stripe/checkout-session/${sessionId}`);
      const data = await res.json();
      setSession(data.session);
    } catch (error) {
      console.error("Error fetching checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
      <p>Subscription ID: {session.subscription?.toString()}</p>
    </div>
  );
};

export default SuccessPage;
