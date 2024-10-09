// pages/admin.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recipient } from "@prisma/client";
import RecipientsManager from "@/components/RecipientsManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HeaderSession from "@/components/HeaderSession"; // Import HeaderSession

interface AdminPageProps {
  onAddRecipient: (recipient: Recipient) => void;
  onOrganizeSecretSanta: (email: string, token: string) => Promise<void>;
}

const AdminPage: React.FC<AdminPageProps> = ({
  onAddRecipient,
  onOrganizeSecretSanta,
}) => {
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleOrganize = async () => {
    if (!email || !token) {
      setError("Veuillez entrer à la fois l'email et le token.");
      return;
    }

    setIsOrganizing(true);
    setError(null);
    try {
      await onOrganizeSecretSanta(email, token);
      alert("Secret Santa organisé avec succès !");
      setEmail("");
      setToken("");
    } catch (err) {
      console.error("Erreur lors de l'organisation du Secret Santa :", err);
      setError(
        "Échec de l'organisation du Secret Santa. Veuillez vérifier vos informations et réessayer."
      );
    } finally {
      setIsOrganizing(false);
    }
  };

  return (
    <div>
      <HeaderSession />

      <div className="container mx-auto p-6 flex flex-col items-center h-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Espace Administrateur
        </h1>
        <p className="text-lg mb-8 text-center">
          Bienvenue dans l&apos;espace administrateur. Ici, vous pouvez gérer
          les participants et organiser un Secret Santa.
        </p>
        <div className="flex justify-center items-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Organisez la liste des participantsz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Ajoutez et gérez les participants de votre Secret Santa.
                </p>
                <RecipientsManager onAddRecipient={onAddRecipient} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Organiser Secret Santa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Attribuez aléatoirement des listes de souhaits à chaque
                  participant pour créer l&apos;effet de surprise et de mystère
                  propre au Secret Santa.
                </p>
                <div className="space-y-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez l'email de l'administrateur"
                    disabled={isOrganizing}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Entrez le token de l'administrateur"
                    disabled={isOrganizing}
                    className="w-full"
                  />
                  <Button
                    onClick={handleOrganize}
                    disabled={isOrganizing}
                    className="w-full"
                  >
                    {isOrganizing
                      ? "Secret Santa est en route !"
                      : "Envoyez une campagne de mails groupée 🎁"}
                  </Button>
                  {error && (
                    <p className="text-red-500 mt-2 text-sm">{error}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
