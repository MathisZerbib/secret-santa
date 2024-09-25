import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaSearch } from "react-icons/fa";
import { Recipient } from "@prisma/client";

interface RecipientsManagerProps {
  onAddRecipient: (recipient: Recipient) => void;
}

const RecipientsManager: React.FC<RecipientsManagerProps> = ({
  onAddRecipient,
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/recipients/get");
      if (!response.ok) {
        throw new Error("Failed to fetch recipients");
      }
      const data = await response.json();
      setRecipients(data);
      setError(null);
    } catch (err) {
      setError("Error fetching recipients. Please try again.");
      console.error("Error fetching recipients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingEmail = async (email: string) => {
    try {
      const response = await fetch(
        `/api/recipients/get-by-email?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) {
        throw new Error("Failed to check email");
      }
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error("Error checking email:", err);
      throw err;
    }
  };

  const handleAddRecipient = async () => {
    if (newName.trim() === "" || newEmail.trim() === "") return;

    try {
      const emailExists = await checkExistingEmail(newEmail.trim());
      if (emailExists) {
        setError("This email already exists. Please use a different email.");
        return;
      }

      const newRecipient = {
        id: Date.now(),
        name: newName.trim(),
        email: newEmail.trim(),
      };
      onAddRecipient(newRecipient);
      setRecipients([...recipients, newRecipient]);
      setNewName("");
      setNewEmail("");
      setError(null);
    } catch (err) {
      console.error("Error adding recipient:", err);
      setError("Failed to add recipient. Please try again.");
    }
  };

  const filteredRecipients = recipients.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(filter.toLowerCase()) ||
      recipient.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nom"
          className="flex-grow"
        />
        <Input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Email"
          className="flex-grow"
        />
        <Button onClick={handleAddRecipient} className="w-full">
          Ajouter un participant
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="flex items-center mb-4 justify-end">
        <div className="flex-grow">
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter recipients"
                  className="w-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="ml-2 flex-shrink-0"
        >
          <FaSearch />
        </Button>
      </div>

      {isLoading ? (
        <p>Loading recipients...</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {filteredRecipients.map((recipient) => (
            <li
              key={recipient.id}
              className="p-3 rounded bg-white shadow flex justify-between items-center"
            >
              <span>{recipient.name}</span>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">{recipient.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipientsManager;
