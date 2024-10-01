import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { formatAmountForStripe } from '../../../utils/stripe-helper';

// Stripe initialization using secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20', // use the Stripe API version
});

const CURRENCY = 'usd'; // Set the currency for the transactions

// Handler for the checkout session creation
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { amount } = req.body; // Get the amount from the request body

        try {
            // Stripe checkout session creation parameters
            const params: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: CURRENCY,
                            product_data: {
                                name: 'Secret Santa Gift Payment',
                            },
                            unit_amount: formatAmountForStripe(amount, CURRENCY),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
            };

            // Create the checkout session with Stripe
            const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

            // Send the session ID to the client
            res.status(200).json({ sessionId: checkoutSession.id });
        } catch (err) {
            // Handle any errors from Stripe
            const errorMessage = err instanceof Error ? err.message : 'Internal server error';
            res.status(500).json({ statusCode: 500, message: errorMessage });
        }
    } else {
        // If method is not POST, return a 405 error
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
