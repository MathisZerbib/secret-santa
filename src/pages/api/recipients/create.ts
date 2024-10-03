// pages/api/recipients/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { giftName, recipientName, recipientEmail, link } = req.body;

    try {
      if (!giftName || !recipientEmail || !recipientName) {
        return res.status(400).json({
          error: "Gift name, recipient name, and recipient email are required",
        });
      }

      // Check if the recipient already exists
      const recipient = await prisma.recipient.findUnique({
        where: { email: recipientEmail },
      });

      let recipientId;

      if (!recipient) {
        // If the recipient does not exist, create a new one
        const newRecipient = await prisma.recipient.create({
          data: {
            name: recipientName,
            email: recipientEmail,
          },
        });
        recipientId = newRecipient.id;
      } else {
        recipientId = recipient.id;
      }

      // Create the new gift associated with the recipient
      const newGift = await prisma.gift.create({
        data: {
          name: giftName,
          recipient: {
            connect: { id: recipientId }, // Connect to the existing or new recipient
          },
          link,
        },
      });

      res.status(200).json(newGift);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding gift" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
