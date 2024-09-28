// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;

        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL as string,
                name: process.env.SENDGRID_FROM_NAME as string,
            },
            subject: 'Pré-inscription à Secret Santa',
            text: 'Merci pour votre pré-inscription à notre service Secret Santa. Nous vous contacterons bientôt avec plus d\'informations.',
            html: '<strong>Merci pour votre pré-inscription à notre service Secret Santa. Nous vous contacterons bientôt avec plus d\'informations.</strong>',
        };

        try {
            await sgMail.send(msg);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}