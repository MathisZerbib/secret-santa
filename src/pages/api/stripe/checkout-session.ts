import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-09-30.acacia",
});

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
	const { priceId } = req.body;

	const session = await getServerSession(req, res, authOptions);

	if (!session?.user) {
		return res.status(401).json({
			error: {
				code: "no-access",
				message: "You are not signed in.",
			},
		});
	}

	try {
		const successUrl = process.env.NEXT_PUBLIC_API_URL + `/success?session_id={CHECKOUT_SESSION_ID}`;
		const cancelUrl = process.env.NEXT_PUBLIC_API_URL + '/cancel';

		console.log("successUrl", successUrl);
		console.log("cancelUrl", cancelUrl);

		console.log("session.user.stripeCustomerId", session.user.stripeCustomerId);
		console.log("priceId", priceId);
		if (!successUrl || !cancelUrl) {
			throw new Error("Environment variables NEXT_PUBLIC_API_URL are not set");
		}

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "subscription",
			customer: session.user.stripeCustomerId,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: successUrl,
			cancel_url: cancelUrl,
			subscription_data: {
				metadata: {
					payingUserId: session.user.id,
				},
				trial_period_days: 14,
			},
		});

		if (!checkoutSession.url) {
			return res.status(500).json({
				error: {
					code: "stripe-error",
					message: "Could not create checkout session",
				},
			});
		}

		return res.status(200).json({ session: checkoutSession });
	} catch (error) {
		console.error("Stripe checkout session error:", error);
		return res.status(500).json({
			error: {
				code: "stripe-error",
				message: "Could not create checkout session",
			},
		});
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		return handlePost(req, res);
	} else {
		return res.status(405).json({
			error: {
				code: "method-not-allowed",
				message: "Method not allowed",
			},
		});
	}
}