import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { groupId } = req.query;

        if (!groupId) {
            return res.status(400).json({ error: 'Group ID is required' });
        }

        try {
            console.log(`Fetching group with ID: ${groupId}`);

            // Check if the group exists
            const group = await prisma.secretSantaGroup.findUnique({
                where: {
                    id: Number(groupId)
                }
            });

            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }


            // Fetch gifts if the group exists
            const gifts = await prisma.gift.findMany({
                where: {
                    secretSantaGroupId: Number(groupId)
                },
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
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}