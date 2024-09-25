import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";

interface GiftFormProps {
  onAddGift: (
    giftName: string,
    recipientName: string,
    recipientEmail: string,
    giftLink: string
  ) => void;
}

const GiftForm: React.FC<GiftFormProps> = ({ onAddGift }) => {
  const [giftName, setGiftName] = useState("");
  const [giftLink, setGiftLink] = useState("");
  const [recipients, setRecipients] = useState<
    { name: string; email: string }[]
  >([]);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllRecipients();
  }, []);

  const fetchAllRecipients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recipients/get");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setRecipients(
        data.map((recipient: { name: string; email: string }) => ({
          name: recipient.name,
          email: recipient.email,
        }))
      );
    } catch (error) {
      setError("Failed to fetch recipients");
      console.error("Failed to fetch recipients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipient = (recipient: {
    name: string;
    email: string;
  }) => {
    setRecipientEmail(recipient.email);
    setRecipientName(recipient.name);
    setOpenDialog(false); // Close dialog after selecting recipient
  };

  const handleAddNewRecipient = () => {
    if (newRecipientName && newRecipientEmail) {
      const newRecipient = { name: newRecipientName, email: newRecipientEmail };
      setRecipients((prev) => [...prev, newRecipient]);
      setRecipientEmail(newRecipientEmail);
      setRecipientName(newRecipientName);
      setOpenDialog(false);
      resetNewRecipientFields();
    }
  };

  const resetNewRecipientFields = () => {
    setNewRecipientName("");
    setNewRecipientEmail("");
  };

  const handleSubmit = () => {
    if (
      giftName.trim() !== "" &&
      recipientEmail.trim() !== "" &&
      recipientName.trim() !== ""
    ) {
      onAddGift(giftName, recipientName, recipientEmail, giftLink);
      resetForm();
    }
  };

  const resetForm = () => {
    setGiftName("");
    setRecipientEmail("");
    setGiftLink("");
    setRecipientName("");
    setNewRecipientName("");
    setNewRecipientEmail("");
  };

  return (
    <div className="space-y-6 mb-4 p-4 bg-gray-50 rounded-lg shadow-lg">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <h2 className="text-xl font-semibold">Ajouter un cadeau</h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          type="text"
          value={giftName}
          onChange={(e) => setGiftName(e.target.value)}
          placeholder="Nom du cadeau"
          className="flex-grow p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
          onClick={() => setOpenDialog(true)}
          className="w-full sm:w-auto"
        >
          {recipientName
            ? `Pour : ${recipientName}`
            : "Choisir un destinataire"}
        </Button>

        <Input
          type="text"
          value={giftLink}
          onChange={(e) => setGiftLink(e.target.value)}
          placeholder="Lien vers l'article (optionnel)"
          className="flex-grow p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full transition duration-200">
        Ajouter à la liste
      </Button>

      {/* Recipient Selection Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <DialogTitle className="text-lg font-semibold">
            Choisir un destinataire
          </DialogTitle>
          <div className="space-y-4 mt-2 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="text-center">Chargement...</div>
            ) : recipients.length > 0 ? (
              recipients.map((recipient) => (
                <div
                  key={recipient.email}
                  onClick={() => handleSelectRecipient(recipient)}
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded-md transition duration-200"
                  role="button"
                  aria-label={`Select ${recipient.name}`}
                >
                  {recipient.name} ({recipient.email})
                </div>
              ))
            ) : (
              <div>Aucun destinataire trouvé</div>
            )}
            <div className="mt-4 p-4">
              <h3 className="text-lg font-semibold">
                Ajouter un nouveau destinataire
              </h3>
              <Input
                type="text"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                placeholder="Nom du destinataire"
                className="mt-2 p-2 border rounded-md"
              />
              <Input
                type="email"
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
                placeholder="Email du destinataire"
                className="mt-2 p-2 border rounded-md"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={() => setOpenDialog(false)} className="mr-2">
                  Annuler
                </Button>
                <Button
                  onClick={handleAddNewRecipient}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftForm;
