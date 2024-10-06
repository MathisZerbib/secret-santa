import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});
const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    const buf = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error("⚠️  Webhook signature verification failed.", err.message);
    } else {
      console.error("⚠️  Webhook signature verification failed.", err);
    }
    return res.status(400).json({ error: "Webhook error" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;

        // Update user's subscription status in the database
        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            isActive: true,
            subscriptionID: subscriptionId,
          },
        });
        console.log(`✅ Subscription ${subscriptionId} for customer ${session.customer} completed.`);
        break;

      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.cancel_at_period_end) {
          await prisma.user.update({
            where: { stripeCustomerId: subscription.customer as string },
            data: { isActive: false, subscriptionID: subscription.id },
          });
          console.log(`⚠️ Subscription ${subscription.id} for customer ${subscription.customer} set to cancel at period end.`);
        }
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: { stripeCustomerId: deletedSubscription.customer as string },
          data: { isActive: false, subscriptionID: null },
        });
        console.log(`❌ Subscription ${deletedSubscription.id} for customer ${deletedSubscription.customer} deleted.`);
        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    if (err instanceof Error) {
      console.error("⚠️  Error handling event.", err.message);
    } else {
      console.error("⚠️  Error handling event.", err);
    }
    res.status(500).json({ error: "Internal server error" });
  }
}