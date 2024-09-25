// components/SecretSantaOrganizer.tsx
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface SecretSantaOrganizerProps {
  onOrganize: (email: string, token: string) => Promise<void>;
}

const SecretSantaOrganizer: React.FC<SecretSantaOrganizerProps> = ({
  onOrganize,
}) => {
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [showFields, setShowFields] = useState(false);

  const handleOrganize = async () => {
    if (!email || !token) {
      setError("Please enter both email and token.");
      return;
    }

    setIsOrganizing(true);
    setError(null);
    try {
      await onOrganize(email, token);
      alert("Secret Santa organized successfully!");
      setEmail("");
      setToken("");
      setShowFields(false);
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
    <div className="mt-4">
      <AnimatePresence>
        {!showFields ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="button"
          >
            <Button onClick={() => setShowFields(true)} className="w-full">
              Organize Secret Santa 🎁
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            key="fields"
            className="space-y-4"
          >
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
              {isOrganizing ? "Organizing..." : "Confirm and Organize"}
            </Button>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecretSantaOrganizer;
