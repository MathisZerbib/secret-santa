// components/AdminSpace.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FaChevronDown, FaLock, FaUnlock } from "react-icons/fa";
import RecipientsManager from "./RecipientsManager";
import SecretSantaOrganizer from "./SecretSantaOrganizer";
import { Recipient } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";

interface AdminSpaceProps {
  onAddRecipient: (recipient: Recipient) => void;
  onOrganizeSecretSanta: (email: string, token: string) => Promise<void>;
}

const AdminSpace: React.FC<AdminSpaceProps> = ({
  onAddRecipient,
  onOrganizeSecretSanta,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUnlock = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/manager/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: password }),
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      setIsUnlocked(true);
    } catch (err) {
      setError("Invalid token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mt-2" ref={dropdownRef}>
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex justify-between items-center bg-white"
        variant="outline"
      >
        Espace Admin
        <FaChevronDown
          className={`ml-2 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="absolute top-full right-0 w-96 mt-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Espace Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {!isUnlocked ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <FaLock className="text-gray-500" />
                        <span>Enter token to unlock admin features</span>
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
                        {isLoading ? "Verifying..." : "Unlock"}
                      </Button>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        <FaUnlock className="text-green-500" />
                        <span>Admin features unlocked</span>
                      </div>
                      <RecipientsManager onAddRecipient={onAddRecipient} />
                      <SecretSantaOrganizer
                        onOrganize={onOrganizeSecretSanta}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSpace;
