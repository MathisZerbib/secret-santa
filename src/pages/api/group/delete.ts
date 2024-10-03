import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        const groupId = parseInt(id, 10);
        const group = await prisma.secretSantaGroup.findUnique({
            where: { id: groupId },
            include: {
                manager: true,
            },

        });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Ensure the user is authorized to delete the group
        if (!session.user || group.manager.email !== session.user.email) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await prisma.secretSantaGroup.delete({
            where: { id: groupId },
        });
    }
    catch (error) {
        console.error("Error deleting group:", error);
        return res.status(500).json({ message: "Failed to delete group" });
    }

    return res.status(200).json({ message: "Group deleted" });

}
