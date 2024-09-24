// pages/api/gifts/update.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, name } = req.body;

    if (!id || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const updatedGift = await prisma.gift.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json(updatedGift);
  } catch (error) {
    console.error("Error updating gift:", error);
    res.status(500).json({ message: "Error updating gift" });
  } finally {
    await prisma.$disconnect();
  }
}
