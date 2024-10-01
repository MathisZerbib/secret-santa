import React from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();

  const cancelSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/subscription-cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { subscription } = await res.json();
      console.log(subscription);
      router.push("/subscription");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={cancelSubscription}>Cancel Subscription</button>
    </div>
  );
};

export default Dashboard;
