// pages/api/checkManager.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const email = session.user.email;
      const manager = await prisma.appManager.findUnique({
        where: { email: email as string },
      });

      if (manager) {
        return res.status(200).json({ isManager: true });
      } else {
        return res.status(200).json({ isManager: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}