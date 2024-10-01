// pages/api/group/validate-invite.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inviteCode } = req.body;

    if (!inviteCode) {
        return res.status(400).json({ error: 'Invite code is required' });
    }

    try {
        // Check if a group with the given invite code exists
        const group = await prisma.secretSantaGroup.findUnique({
            where: { inviteCode },
            select: { id: true, name: true }  // You can select more fields if needed
        });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // If we reach here, the invite code is valid
        return res.status(200).json({
            message: 'Valid invite code',
            groupId: group.id,
            groupName: group.name
        });

    } catch (error) {
        console.error('Error validating invite code:', error);
        return res.status(500).json({ error: 'An error occurred while validating the invite code' });
    } finally {
        await prisma.$disconnect();
    }
}