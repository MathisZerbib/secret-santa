import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    setOpenDialog(false);
  };

  const handleAddNewRecipient = async () => {
    if (newRecipientName && newRecipientEmail) {
      try {
        const response = await fetch("/api/recipients/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newRecipientName,
            email: newRecipientEmail,
          }),
        });
        if (!response.ok) throw new Error("Failed to add new recipient");
        const newRecipient = await response.json();
        setRecipients((prev) => [...prev, newRecipient]);
        setRecipientEmail(newRecipient.email);
        setRecipientName(newRecipient.name);
        setOpenDialog(false);
        resetNewRecipientFields();
      } catch (error) {
        console.error("Error adding new recipient:", error);
        setError("Failed to add new recipient");
      }
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
    <div className="space-y-6 mb-4 p-4 rounded-lg shadow-lg">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <h2 className="text-xl font-semibold text-white">Ajouter un cadeau</h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 text-white">
        <Input
          type="text"
          value={giftName}
          onChange={(e) => setGiftName(e.target.value)}
          placeholder="Nom du cadeau"
          className="placeholder:text-white"
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
          className="placeholder:text-white"
        />
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Ajouter à la liste
      </Button>

      <Dialog open={openDialog} onOpenChange={setOpenDialog} modal={false}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">
              Choisir un destinataire
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            {loading ? (
              <div className="text-center text-black">Chargement...</div>
            ) : recipients.length > 0 ? (
              recipients.map((recipient) => (
                <div
                  key={recipient.email}
                  onClick={() => handleSelectRecipient(recipient)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition duration-200 text-black"
                >
                  {recipient.name} ({recipient.email})
                </div>
              ))
            ) : (
              <div>Aucun destinataire trouvé</div>
            )}
          </ScrollArea>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Ajouter un nouveau destinataire
            </h3>
            <Input
              type="text"
              value={newRecipientName}
              onChange={(e) => setNewRecipientName(e.target.value)}
              placeholder="Nom du destinataire"
              className="mb-2 text-white"
            />
            <Input
              type="email"
              value={newRecipientEmail}
              onChange={(e) => setNewRecipientEmail(e.target.value)}
              placeholder="Email du destinataire"
              className="text-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="text-black"
            >
              Annuler
            </Button>
            <Button onClick={handleAddNewRecipient}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftForm;
