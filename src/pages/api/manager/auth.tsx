// pages/api/manager/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.body;

  try {
    const manager = await prisma.appManager.findUnique({
      where: { token },
    });

    if (!manager) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "Token verified successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
