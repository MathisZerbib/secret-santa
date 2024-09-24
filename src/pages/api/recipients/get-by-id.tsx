import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const recipient = await prisma.recipient.findUnique({
      where: { id: Number(id) },
    });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    res.status(200).json(recipient);
  } catch (error) {
    console.error("Error fetching recipient:", error);
    res.status(500).json({ message: "Error fetching recipient" });
  } finally {
    await prisma.$disconnect();
  }
}
