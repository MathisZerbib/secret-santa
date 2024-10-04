import Stripe from "stripe";
import prisma from "../../../../prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-09-30.acacia",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

const webhookHandler = async (req: NextRequest) => {
	try {
		const buf = await req.text();
		const sig = req.headers.get("stripe-signature")!;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error";
			console.log(`❌ Error message: ${errorMessage}`);

			return NextResponse.json(
				{
					error: {
						message: `Webhook Error: ${errorMessage}`,
					},
				},
				{ status: 400 }
			);
		}

		console.log("✅ Success:", event.id);

		const subscription = event.data.object as Stripe.Subscription;
		const subscriptionId = subscription.id;

		switch (event.type) {
			case "customer.subscription.created":
				await prisma.user.update({
					where: {
						stripeCustomerId: subscription.customer as string,
					},
					data: {
						isActive: true,
						subscriptionID: subscriptionId,
					},
				});
				break;
			case "customer.subscription.deleted":
				await prisma.user.update({
					where: {
						stripeCustomerId: subscription.customer as string,
					},
					data: {
						isActive: false,
					},
				});
				break;

			default:
				console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
				break;
		}

		return NextResponse.json({ received: true });
	} catch {
		return NextResponse.json(
			{
				error: {
					message: `Method Not Allowed`,
				},
			},
			{ status: 405 }
		).headers.set("Allow", "POST");
	}
};

export { webhookHandler as POST };