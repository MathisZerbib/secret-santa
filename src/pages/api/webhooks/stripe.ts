import Stripe from 'stripe';
import prisma
  from '../../../../prisma/prisma';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

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

  // Return a 200 response immediately
  res.status(200).json({ received: true });

  // Process the event asynchronously
  handleWebhookEvent(event).catch(console.error);
}
async function handleWebhookEvent(event: Stripe.Event) {
  try {
    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`💰 Invoice ${invoice.id} for customer ${invoice.customer} paid.`);

        // Update the user
        const updatedUser = await prisma.user.update({
          where: { stripeCustomerId: invoice.customer as string },
          data: { isActive: true, subscriptionID: invoice.subscription as string },
        });

        if (!updatedUser) {
          console.error(`User not found for customer ${invoice.customer}`);
          return;
        }

        // Check if an AppManager already exists for this user
        let appManager = await prisma.appManager.findUnique({
          where: { email: updatedUser.email! },
        });

        if (!appManager) {
          // Create a new AppManager
          appManager = await prisma.appManager.create({
            data: {
              email: updatedUser.email!,
              token: generateUniqueToken(), // You need to implement this function
              hasPaid: true,
            },
          });
          console.log(`Created new AppManager for ${updatedUser.email}`);
        } else {
          // Update existing AppManager
          appManager = await prisma.appManager.update({
            where: { email: updatedUser.email! },
            data: { hasPaid: true },
          });
          console.log(`Updated AppManager for ${updatedUser.email}`);
        }

        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: { stripeCustomerId: deletedSubscription.customer as string },
          data: { isActive: false, subscriptionID: null },
        });
        console.log(`❌ Subscription ${deletedSubscription.id} for customer ${deletedSubscription.customer} deleted.`);

        // Optionally, update AppManager here if needed
        // For example, set hasPaid to false
        await prisma.appManager.updateMany({
          where: { email: deletedSubscription.customer as string },
          data: { hasPaid: false },
        });

        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error("⚠️  Error handling event.", err);
  }
}

// Helper function to generate a unique token
function generateUniqueToken(): string {
  // Implement your token generation logic here
  // For example, you could use a library like `uuid` or create your own algorithm
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}