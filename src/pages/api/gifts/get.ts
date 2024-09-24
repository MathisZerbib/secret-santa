import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const gifts = await prisma.gift.findMany({
                include: {
                    recipient: { // Include recipient details
                        select: {
                            id: true,
                            name: true, // Assuming 'name' is the field in your Recipient model
                            email: true // Include any other fields you need
                        }
                    }
                }
            });
            res.status(200).json(gifts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching gifts' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
