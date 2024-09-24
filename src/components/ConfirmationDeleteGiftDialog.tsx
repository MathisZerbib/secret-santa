// ConfirmationDeleteGiftDialog.tsx
import React from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

interface ConfirmationDeleteGiftDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  giftName: string; // Added prop for the gift's name
  recipientName: string; // Added prop for the recipient's name
}

const ConfirmationDeleteGiftDialog: React.FC<
  ConfirmationDeleteGiftDialogProps
> = ({ open, onConfirm, onCancel, giftName, recipientName }) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
      <DialogContent className="fixed inset-0 bg-white p-6 flex flex-col justify-center items-center">
        <DialogTitle className="text-lg font-semibold">
          Êtes-vous sûr de vouloir supprimer ce cadeau?
        </DialogTitle>
        <p className="mt-2">
          Cadeau: <strong>{giftName}</strong>
        </p>
        <p>
          Pour : <strong>{recipientName}</strong>
        </p>
        <div className="flex space-x-4 mt-4">
          <Button onClick={onCancel} variant="outline">
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600 transition duration-200"
          >
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDeleteGiftDialog;
