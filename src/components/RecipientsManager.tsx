import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaSearch, FaTrash } from "react-icons/fa";
import { Recipient } from "@prisma/client";
import ConfirmationDeleteRecipientDialog from "./ConfirmationDeleteRecipientDialog"; // Import the modal

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
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recipientToDelete, setRecipientToDelete] = useState<number | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipients/get`
      );
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

  const handleDeleteRecipient = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipients/${id}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete recipient");
      }

      setRecipients((prevRecipients) =>
        prevRecipients.filter((recipient) => recipient.id !== id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting recipient:", error);
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setRecipientToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (recipientToDelete !== null) {
      handleDeleteRecipient(recipientToDelete);
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
        <Button onClick={() => onAddRecipient} className="w-full">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDeleteModal(recipient.id)} // Wrap the function call
                  className="ml-2"
                >
                  <FaTrash className="text-red-500" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation Modal for deletion */}
      <ConfirmationDeleteRecipientDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default RecipientsManager;
