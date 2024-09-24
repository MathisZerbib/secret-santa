// This file is responsible for fetching a recipient by email

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { email } = req.query;

    try {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const recipient = await prisma.recipient.findUnique({
        where: { email: email.toString() },
      });

      res.status(200).json(recipient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching recipient" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
