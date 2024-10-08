// components/AdminSpace.tsx
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { FaLock, FaUnlock } from "react-icons/fa";
import RecipientsManager from "./RecipientsManager";
import SecretSantaOrganizer from "./SecretSantaOrganizer";
import { Recipient } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";

interface AdminSpaceProps {
  onAddRecipient: (recipient: Recipient) => void;
  onOrganizeSecretSanta: (email: string, token: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

const AdminSpace: React.FC<AdminSpaceProps> = ({
  onAddRecipient,
  onOrganizeSecretSanta,
  isOpen,
  onClose,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/manager/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      setIsUnlocked(true);
    } catch (err) {
      console.error("Error unlocking admin features:", err);
      setError("Invalid token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const containerVariants = {
  //   hidden: { opacity: 0, height: 0 },
  //   visible: {
  //     opacity: 1,
  //     height: "auto",
  //     transition: {
  //       duration: 0.1,
  //       ease: "easeInOut",
  //       when: "beforeChildren",
  //       staggerChildren: 0.1,
  //     },
  //   },
  //   exit: {
  //     opacity: 0,
  //     height: 0,
  //     transition: {
  //       duration: 0.3,
  //       ease: "easeInOut",
  //       when: "afterChildren",
  //       staggerChildren: 0.05,
  //       staggerDirection: -1,
  //     },
  //   },
  // };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Espace Admin</DialogTitle>
          <DialogDescription>
            {isUnlocked
              ? "Espace Admin débloqué"
              : "Veuillez entrer le mot de passe pour déverrouiller"}
          </DialogDescription>
        </DialogHeader>
        <Card className="w-96 shadow-lg overflow-hidden">
          <CardContent>
            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div
                  key="locked"
                  variants={contentVariants}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <FaLock className="text-gray-500" />
                    <span>
                      Veuillez entrer le mot de passe pour déverrouiller
                    </span>
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter token"
                  />
                  <Button
                    onClick={handleUnlock}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Vérification..." : "Déverrouiller"}
                  </Button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </motion.div>
              ) : (
                <motion.div key="unlocked" variants={contentVariants}>
                  <div className="flex items-center space-x-2 mb-4">
                    <FaUnlock className="text-green-500" />
                    <span>Espace Admin débloqué</span>
                  </div>
                  <motion.div variants={contentVariants}>
                    <RecipientsManager onAddRecipient={onAddRecipient} />
                  </motion.div>
                  <motion.div variants={contentVariants}>
                    <SecretSantaOrganizer onOrganize={onOrganizeSecretSanta} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default AdminSpace;
