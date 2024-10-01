// pages/api/create-intent.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 5000, // $50.00
                currency: 'usd',
                payment_method_types: ['card'],
                metadata: { integration_check: 'accept_a_payment' }
            });

            res.status(200).json({ client_secret: paymentIntent.client_secret });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}