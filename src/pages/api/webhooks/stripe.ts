import Stripe from 'stripe';
import prisma
  from '../../../../prisma/prisma';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!endpointSecret) {
  throw new Error('Missing Stripe webhook secret');
}

import { NextApiRequest, NextApiResponse } from 'next';

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

    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret!);
  } catch (err) {
    if (err instanceof Error) {
      console.error("⚠️  Webhook signature verification failed.", err.message);
    } else {
      console.error("⚠️  Webhook signature verification failed.", err);
    }
    return res.status(400).json({ error: "Webhook error" });
  }

  try {
    console.log("event type", event.type);
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