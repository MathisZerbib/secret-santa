// components/AdminPage.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Recipient } from "@prisma/client";
import RecipientsManager from "../components/RecipientsManager";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
      setError("Please enter both email and token.");
      return;
    }

    setIsOrganizing(true);
    setError(null);
    try {
      await onOrganizeSecretSanta(email, token);
      alert("Secret Santa organized successfully!");
      setEmail("");
      setToken("");
    } catch (err) {
      console.error("Error organizing Secret Santa:", err);
      setError(
        "Failed to organize Secret Santa. Please check your credentials and try again."
      );
    } finally {
      setIsOrganizing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipientsManager onAddRecipient={onAddRecipient} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Organize Secret Santa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                disabled={isOrganizing}
              />
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token"
                disabled={isOrganizing}
              />
              <Button
                onClick={handleOrganize}
                disabled={isOrganizing}
                className="w-full"
              >
                {isOrganizing ? "Organizing..." : "Organize Secret Santa 🎁"}
              </Button>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
