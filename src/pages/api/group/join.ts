// pages/api/group/join.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inviteCode, email, name } = req.body;

    if (!inviteCode || !email || !name) {
        return res.status(400).json({ error: 'Invite code, email, and name are required' });
    }

    try {
        // Find the group with the given invite code
        const group = await prisma.secretSantaGroup.findUnique({
            where: { inviteCode },
        });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the recipient already exists
        let recipient = await prisma.recipient.findUnique({
            where: { email },
        });

        if (!recipient) {
            // If the recipient doesn't exist, create a new recipient
            recipient = await prisma.recipient.create({
                data: {
                    email,
                    name,
                    SecretSantaGroup: {
                        connect: { id: group.id }
                    }
                },
            });
        } else {
            // If the recipient exists, check if they're already in the group
            const existingMembership = await prisma.secretSantaGroup.findFirst({
                where: {
                    id: group.id,
                    recipients: {
                        some: {
                            id: recipient.id
                        }
                    }
                },
            });

            if (existingMembership) {
                return res.status(400).json({ error: 'Recipient is already a member of this group' });
            }

            // If not, add them to the group
            await prisma.secretSantaGroup.update({
                where: { id: group.id },
                data: {
                    recipients: {
                        connect: { id: recipient.id }
                    }
                }
            });
        }

        return res.status(200).json({ message: 'Successfully joined the group' });
    } catch (error) {
        console.error('Error joining group:', error);
        return res.status(500).json({ error: 'An error occurred while joining the group' });
    } finally {
        await prisma.$disconnect();
    }
}