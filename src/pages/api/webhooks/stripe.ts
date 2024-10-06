import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { buffer } from "micro";
import Cors from "micro-cors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});
const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", (err as Error).message);
    return res.status(400).json({ error: "Webhook error" });
  }

  console.log(`Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`💰 Invoice ${invoice.id} for customer ${invoice.customer} paid.`);
        await prisma.user.update({
          where: { stripeCustomerId: invoice.customer as string },
          data: { isActive: true },
        });
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("⚠️  Error handling event.", (err as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default cors(handler);