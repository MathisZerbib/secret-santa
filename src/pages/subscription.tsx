"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { subscription } from "../../constants";
import { SubscriptionCard } from "../components/SubscriptionCard";
import HeaderSession from "@/components/HeaderSession";
import Loader from "@/components/ui/loader";

function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/app");
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/app" });
  };

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div>
      <HeaderSession
        userName={session?.user?.name || ""}
        onLogout={() => handleLogout()}
      />
      <div className="flex flex-col items-center justify-center py-20">
        <div className="m-auto w-fit flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-20 sm:mb-10 md:mb-16 text-white">
            Choisissez votre plan
          </h1>

          <div className="grid lg:grid-cols-3 gap-10">
            {subscription &&
              subscription.map((sub, i) => (
                <SubscriptionCard
                  key={i}
                  planType={sub.planType}
                  price={sub.price}
                  priceId={sub.priceId}
                />
              ))}
          </div>
        </div>
      </div>
      <p className="text-center text-white mb-8 italic">
        Essai Gratuit de 14 jours. Vous pouvez annuler à tout moment.
      </p>
    </div>
  );
}

export default SubscriptionPage;
