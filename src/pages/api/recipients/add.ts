import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, secretSantaGroupId }: { name: string; email: string; secretSantaGroupId: number } = req.body;

        if (!name || !email || !secretSantaGroupId) {
            return res.status(400).json({ error: 'Name, email, and secretSantaGroupId are required' });
        }

        try {
            const newRecipient = await prisma.recipient.create({
                data: {
                    name,
                    email,
                    secretSantaGroupId,
                },
            });

            return res.status(201).json(newRecipient);
        } catch (error) {
            console.error('Error adding new recipient:', error);
            return res.status(500).json({ error: 'Failed to add new recipient' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}