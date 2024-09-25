// pages/api/secret-santa.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Gift, Recipient } from "@prisma/client";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface SecretSantaAssignment {
  giver: Recipient;
  receiver: Recipient & { gifts: Gift[] };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the manager token
    const manager = await prisma.appManager.findUnique({ where: { token } });
    if (!manager) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const recipients = await prisma.recipient.findMany({
      include: { gifts: true },
    });

    if (recipients.length < 2) {
      return res
        .status(400)
        .json({ message: "Not enough participants for Secret Santa" });
    }

    const assignments = assignSecretSantas(recipients);

    for (const assignment of assignments) {
      await sendSecretSantaEmail(assignment);
    }

    res.status(200).json({ message: "Secret Santa organized successfully" });
  } catch (error) {
    console.error("Error organizing Secret Santa:", error);
    res.status(500).json({ message: "Failed to organize Secret Santa" });
  }
}

function assignSecretSantas(
  participants: (Recipient & { gifts: Gift[] })[]
): SecretSantaAssignment[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  return shuffled.map((giver, index) => ({
    giver,
    receiver: shuffled[(index + 1) % shuffled.length],
  }));
}

async function sendSecretSantaEmail(
  assignment: SecretSantaAssignment
): Promise<void> {
  const { giver, receiver } = assignment;

  const giftList = receiver.gifts
    .map((gift) => {
      return `
      <li>
        ${gift.name}
        ${gift.link ? ` (<a href="${gift.link}">link</a>)` : ""}
        ${gift.bought ? " (already bought)" : ""}
      </li>
    `;
    })
    .join("");

  const msg = {
    to: giver.email,
    from: process.env.SENDGRID_FROM_EMAIL as string,
    subject: "Your Secret Santa Assignment",
    text: `Hello ${giver.name},

You've been assigned to be the Secret Santa for ${receiver.name}.

Here is ${receiver.name}'s gift list:

${receiver.gifts
  .map(
    (gift) =>
      `- ${gift.name}${gift.link ? ` (${gift.link})` : ""}${
        gift.bought ? " (already bought)" : ""
      }`
  )
  .join("\n")}

Happy gifting!`,
    html: `
      <p>Hello ${giver.name},</p>
      <p>You've been assigned to be the Secret Santa for <strong>${receiver.name}</strong>.</p>
      <p>Here is ${receiver.name}'s gift list:</p>
      <ul>
        ${giftList}
      </ul>
      <p>Happy gifting!</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${giver.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
