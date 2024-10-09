import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {

            const session = await getServerSession(req, res, authOptions);

            if (!session) {
                console.log("Unauthorized Session");
                return res.status(401).json({ error: "Unauthorized Session" });
            }

            const userId = session.user?.id;

            if (!userId) {
                console.log("Unauthorized user");
                return res.status(401).json({ error: "Unauthorized user" });
            }

            // Find the User and their associated AppManager
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { appManagerId: true },
            });
            console.log("User:", user);

            if (!user || !user.appManagerId) {
                console.log("appManager not found for this user");
                return res.status(404).json({ error: "appManager not found for this user" });
            }

            // Fetch the SecretSantaGroups managed by this appManager
            const groups = await prisma.secretSantaGroup.findMany({
                where: {
                    managerId: user.appManagerId,
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
            console.log("Groups:", groups);

            res.status(200).json(groups);
        } catch (error) {
            console.error("Error fetching Secret Santa groups:", error);
            res.status(500).json({ error: "Error fetching Secret Santa groups" });
        } finally {
            await prisma.$disconnect();
            console.log("Disconnected from Prisma");
        }
    } else {
        console.log(`Method ${req.method} Not Allowed`);
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}