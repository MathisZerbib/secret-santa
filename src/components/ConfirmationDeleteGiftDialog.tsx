import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDeleteGiftDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  giftName: string;
  recipientName: string;
}

const ConfirmationDeleteGiftDialog: React.FC<
  ConfirmationDeleteGiftDialogProps
> = ({ open, onConfirm, onCancel, giftName, recipientName }) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="p-4">Confirmer la suppression</DialogTitle>
          <DialogDescription className="px-4">
            Êtes-vous sûr de vouloir supprimer ce cadeau?
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p>
            Cadeau: <strong>{giftName}</strong>
          </p>
          <p>
            Pour : <strong>{recipientName}</strong>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDeleteGiftDialog;
