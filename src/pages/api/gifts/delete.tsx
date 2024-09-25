import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      const deletedGift = await prisma.gift.delete({
        where: { id: Number(id) },
      });
      res.status(200).json(deletedGift);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting gift" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
