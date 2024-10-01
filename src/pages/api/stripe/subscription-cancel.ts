import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-06-20",
});

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);

	if (!session?.user) {
		return res.status(401).json({
			error: {
				code: "no-access",
				message: "Vous n'êtes pas connecté.",
			},
		});
	}

	const stripeSubscriptionId = session.user.subscriptionID;

	try {
		const subscription = await stripe.subscriptions.update(
			stripeSubscriptionId,
			{
				cancel_at_period_end: true,
			}
		);

		return res.status(200).json({ subscription });
	} catch {
		return res.status(500).json({
			error: {
				code: "stripe-error",
				message: "Impossible d'annuler l'abonnement",
			},
		});
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		return handleGet(req, res);
	} else {
		return res.status(405).json({
			error: {
				code: "method-not-allowed",
				message: "Méthode non autorisée",
			},
		});
	}
}