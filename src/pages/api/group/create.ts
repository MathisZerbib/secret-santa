import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import sgMail from "@sendgrid/mail";

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, managerEmail } = req.body;
    console.log("Création du groupe avec le nom :", name, "et l'email du gestionnaire :", managerEmail);

    // Validation de l'entrée
    if (!name || !managerEmail) {
      return res.status(400).json({ error: "Le nom et l'email du gestionnaire sont requis" });
    }

    try {
      // Récupérer le gestionnaire
      let manager = await prisma.appManager.findUnique({
        where: { email: managerEmail },
      });

      // TODO - Faire cela lors de l'inscription
      if (!manager) {
        // Créer un nouveau gestionnaire s'il n'existe pas
        manager = await prisma.appManager.create({
          data: {
            email: managerEmail,
            token: nanoid(),
            hasPaid: false, // Définir la valeur par défaut
          },
        });
      }

      // Générer un code d'invitation unique
      const inviteCode = nanoid(8);

      // Créer le groupe Secret Santa
      const group = await prisma.secretSantaGroup.create({
        data: {
          name,
          inviteCode,
          managerId: manager.id,
        },
      });

      // Ajouter l'appManagerId à l'utilisateur
      await prisma.user.update({
        where: { email: managerEmail },
        data: {
          appManagerId: manager.id,
        },
      });

      // Envoyer un email avec le code d'invitation
      const msg = {
        to: managerEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL as string,
          name: process.env.SENDGRID_FROM_NAME as string,
        },
        subject: 'Votre code d\'invitation pour le groupe Secret Santa',
        text: `Votre code d'invitation pour le groupe Secret Santa "${name}" est : ${inviteCode}, votre mot de passe administrateur est : ${manager.token}`,
        html: `<p>Votre code d'invitation pour le groupe Secret Santa "${name}" est : <strong>${inviteCode}</strong>, votre mot de passe administrateur est : <strong>${manager.token}</strong></p>`,
      };

      await sgMail.send(msg);

      return res.status(200).json({ inviteCode, groupId: group.id, name: group.name });
    } catch (error) {
      console.error("Erreur lors de la création du groupe :", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
}