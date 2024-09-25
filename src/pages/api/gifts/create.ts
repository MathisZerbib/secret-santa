// Example: /api/gifts/create.js
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { giftName, recipientName, recipientEmail, link } = req.body;

        try {
            const newGift = await prisma.gift.create({
                data: {
                    name: giftName,
                    link: link,
                    recipient: {
                        connectOrCreate: {
                            where: { email: recipientEmail },
                            create: { name: recipientName, email: recipientEmail },
                        },
                    },
                },
                include: {
                    recipient: true, // Include recipient information
                },
            });

            res.status(201).json(newGift); // Send back the gift with recipient info
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create gift" });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
