import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import EditableLinkButton from "@/components/EditableLinkButton";
import { Gift } from "@/types/gift";
import { FaPencilAlt, FaTrash } from "react-icons/fa"; // Import the trash icon
import { Button } from "./ui/button";
import ConfirmationDeleteGiftDialog from "./ConfirmationDeleteGiftDialog"; // Import the confirmation dialog

interface GiftListProps {
  gifts: Gift[];
  filter: string;
  onUpdateLink: (id: number, newLink: string) => void;
  // onConfirmBuy: (gift: Gift) => void;
  onUpdateName: (id: number, newName: string) => void;
  onDeleteGift: (id: number) => void; // New prop for deleting gifts
}

function GiftList({
  gifts,
  filter,
  onUpdateLink,
  // onConfirmBuy,
  onUpdateName,
  onDeleteGift, // Destructure the new delete handler
}: GiftListProps) {
  const [editGiftId, setEditGiftId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleteGiftId, setDeleteGiftId] = useState<number | null>(null); // State for selected gift to delete
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to control delete confirmation dialog

  const filteredGifts = gifts.filter(
    (gift) =>
      gift.name.toLowerCase().includes(filter.toLowerCase()) ||
      gift.recipient.name.toLowerCase().includes(filter.toLowerCase()) ||
      gift.recipient.email.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (editGiftId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editGiftId]);

  const handleEditClick = (gift: Gift) => {
    setEditGiftId(gift.id);
    setEditedName(gift.name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameBlur = async () => {
    if (editGiftId !== null && editedName.trim() !== "") {
      const currentGift = gifts.find((gift) => gift.id === editGiftId);
      if (currentGift && currentGift.name !== editedName.trim()) {
        await onUpdateName(editGiftId, editedName.trim());
      }
      setEditGiftId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameBlur();
    } else if (e.key === "Escape") {
      setEditGiftId(null);
    }
  };

  const handleDeleteClick = (gift: Gift) => {
    setDeleteGiftId(gift.id); // Set the gift ID to be deleted
    setShowDeleteConfirmation(true); // Show the confirmation dialog
  };

  const handleConfirmDelete = async () => {
    if (deleteGiftId !== null) {
      try {
        await fetch(`/api/gifts/delete`, {
          method: "DELETE",
          body: JSON.stringify({ id: deleteGiftId }),
          headers: { "Content-Type": "application/json" },
        });

        // Call the onDeleteGift prop to update the gift list in parent
        onDeleteGift(deleteGiftId); // Trigger the callback to delete gift from parent state
      } catch (error) {
        console.error("Failed to delete gift:", error);
      }

      setDeleteGiftId(null); // Clear the delete ID
    }
    setShowDeleteConfirmation(false); // Close the confirmation dialog
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false); // Just close the dialog without deleting
  };

  const giftToDelete =
    deleteGiftId !== null
      ? gifts.find((gift) => gift.id === deleteGiftId)
      : null;

  return (
    <div className="max-h-96 overflow-y-auto">
      <ul className="space-y-2">
        {filteredGifts.map((gift) => (
          <li
            key={gift.id}
            className={`flex justify-between items-center p-3 rounded ${
              gift.bought ? "bg-gray-100 text-gray-500" : "bg-transparent"
            }`}
          >
            <div className="flex-grow flex items-center">
              {editGiftId === gift.id ? (
                <Input
                  ref={inputRef}
                  value={editedName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  onKeyDown={handleKeyDown}
                  className="mr-2"
                />
              ) : (
                <>
                  <span className={gift.bought ? "line-through" : "text-white"}>
                    {gift.name}
                  </span>
                  <button
                    onClick={() => handleEditClick(gift)}
                    className="ml-2 p-1 text-white hover:text-gray-400"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                </>
              )}
              <span className="ml-2 text-sm text-white">
                (Pour : {gift.recipient && gift.recipient.name})
              </span>
            </div>
            <div className="flex items-center">
              <EditableLinkButton
                initialLink={gift.link || ""}
                onSave={(newLink) => onUpdateLink(gift.id, newLink)}
              />
              {/* {!gift.bought && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onConfirmBuy(gift)}
                  className="ml-2"
                >
                  Acheter
                </Button>
              )} */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(gift)}
                className="ml-2 text-white"
              >
                <FaTrash />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Confirmation Dialog */}
      {giftToDelete && (
        <ConfirmationDeleteGiftDialog
          open={showDeleteConfirmation}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          giftName={giftToDelete.name}
          recipientName={giftToDelete.recipient.name}
        />
      )}
    </div>
  );
}

export default GiftList;
