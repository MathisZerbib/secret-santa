import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, managerEmail } = req.body;

    // Validate input
    if (!name || !managerEmail) {
      return res
        .status(400)
        .json({ error: "Name and manager email are required" });
    }

    try {
      // Fetch manager
      let manager = await prisma.appManager.findUnique({
        where: { email: managerEmail },
      });

      if (!manager) {
        // Create a new manager if they don't exist
        manager = await prisma.appManager.create({
          data: {
            email: managerEmail,
            token: nanoid(),
            hasPaid: false, // Set default value
          },
        });
      }

      // Check if the manager has paid
      // if (!manager.hasPaid) {
      //   return res
      //     .status(403)
      //     .json({ error: "Payment required to create a group" });
      // }

      // Generate a unique invite code
      const inviteCode = nanoid(8);

      // Create the Secret Santa Group
      const group = await prisma.secretSantaGroup.create({
        data: {
          name,
          inviteCode,
          managerId: manager.id,
        },
      });

      return res.status(200).json({ inviteCode, groupId: group.id });
    } catch (error) {
      console.error("Error creating group:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
