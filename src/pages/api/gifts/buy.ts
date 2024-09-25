// pages/api/gifts/buy.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PATCH') {
        const { id } = req.body;
        try {
            const updatedGift = await prisma.gift.update({
                where: { id },
                data: { bought: true },
            });
            res.status(200).json(updatedGift);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error marking gift as bought' });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}