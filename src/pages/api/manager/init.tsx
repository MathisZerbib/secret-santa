import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if an app manager already exists
    const existingManager = await prisma.appManager.findFirst();
    if (existingManager) {
      return res
        .status(400)
        .json({ message: "App manager already initialized" });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Create the app manager
    const manager = await prisma.appManager.create({
      data: {
        email,
        token,
      },
    });

    if (!manager) {
      return res
        .status(500)
        .json({ message: "Failed to initialize app manager" });
    } else if (manager) {
      return res
        .status(201)
        .json({ message: "App manager initialized", token });
    }

    res.status(201).json({ message: "App manager initialized", token });
  } catch (error) {
    console.error("Error initializing app manager:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
