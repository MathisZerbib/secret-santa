// pages/api/get-secret-santa-groups.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
        try {
            const groups = await prisma.secretSantaGroup.findMany({
                where: {
                    manager: {
                        email: session.user?.email || "",
                    },
                },
                select: {
                    inviteCode: true,
                    name: true,
                    id: true,
                    manager: true,
                    recipients: true,
                    gifts: true,
                },
            });

            res.status(200).json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching Secret Santa groups" });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}