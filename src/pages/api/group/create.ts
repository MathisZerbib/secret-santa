import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client";
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, managerEmail } = req.body;
    console.log("Creating group with name:", name, "and manager email:", managerEmail);
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

      // Send email with invite code
      const msg = {
        to: managerEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL as string,
          name: process.env.SENDGRID_FROM_NAME as string,
        },
        subject: 'Your Secret Santa Group Invite Code',
        text: `Your invite code for the Secret Santa group "${name}" is: ${inviteCode}`,
        html: `<strong>Your invite code for the Secret Santa group "${name}" is: ${inviteCode}</strong>`,
      };

      await sgMail.send(msg);

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