import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }

    try {
      console.log("groupId", groupId);
      // Check if the group exists
      const group = await prisma.secretSantaGroup.findUnique({
        where: {
          id: Number(groupId),
        },
      });

      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Fetch group details if the group exists
      const groupDetails = await prisma.secretSantaGroup.findUnique({
        where: {
          id: Number(groupId),
        },
        include: {
          manager: {
            // Include manager details
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json(groupDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching group" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
