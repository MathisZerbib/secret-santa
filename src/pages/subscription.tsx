"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { subscription } from "../../constants";
import { SubscriptionCard } from "../components/SubscriptionCard";
import HeaderSession from "@/components/HeaderSession";

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HeaderSession
        userName={session?.user?.name || ""}
        onLogout={() => handleLogout()}
      />
      <div className="flex flex-col items-center justify-center py-20">
        <div className="m-auto w-fit flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-8">
            Choisissez votre plan
          </h1>
          <div className="grid lg:grid-cols-3 gap-10">
            {subscription.map((sub, i) => (
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
    </div>
  );
}

export default SubscriptionPage;
