import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaEnvelope } from "react-icons/fa";
import { Recipient } from "@prisma/client";


interface RecipientsManagerProps {
  recipients: Recipient[];
  onAddRecipient: (recipient: Recipient) => void;
}

const RecipientsManager: React.FC<RecipientsManagerProps> = ({
  recipients,
  onAddRecipient,
}) => {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const handleAddRecipient = () => {
    if (newName.trim() === "" || newEmail.trim() === "") return;
    onAddRecipient({ id: Date.now(), name: newName.trim(), email: newEmail.trim() });
    setNewName("");
    setNewEmail("");
  };

  const filteredRecipients = recipients.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(filter.toLowerCase()) ||
      recipient.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Recipients List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Recipient name"
            className="flex-grow"
          />
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Recipient email"
            className="flex-grow"
          />
          <Button onClick={handleAddRecipient} className="w-full">
            Add Recipient
          </Button>
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
            <FaFilter />
          </Button>
        </div>

        <ul className="space-y-2">
          {filteredRecipients.map((recipient, index) => (
            <li
              key={index}
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
      </CardContent>
    </Card>
  );
};

export default RecipientsManager;
