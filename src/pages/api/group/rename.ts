import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            const { id } = req.query;
            const { name } = req.body;

            if (!id || typeof id !== "string") {
                return res.status(400).json({ error: "ID de groupe invalide" });
            }

            if (!name || typeof name !== "string") {
                return res.status(400).json({ error: "Nom de groupe invalide" });
            }

            const group = await prisma.secretSantaGroup.update({
                where: { id: Number(id) },
                data: { name },
            });

            res.status(200).json(group);
        } catch (error) {
            console.error("Erreur lors du changement de nom du groupe:", error);
            res.status(500).json({ error: "Erreur lors du changement de nom du groupe" });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}