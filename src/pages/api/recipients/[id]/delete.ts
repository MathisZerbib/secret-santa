/// delete a recipient and its gifts from the database
// DELETE /api/recipients/

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Recipient ID must be a string" });
    }

    try {
      await prisma.gift.deleteMany({
        where: { recipientId: parseInt(id, 10) },
      });

      await prisma.recipient.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting recipient" });
    } finally {
      await prisma.$disconnect();
    }
  }
  else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
