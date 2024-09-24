import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Gift } from "../types/gift";

interface GiftDialogProps {
  gift: Gift | null;
  onClose: () => void;
  onConfirmBuy: () => void;
}

const GiftDialog: React.FC<GiftDialogProps> = ({
  gift,
  onClose,
  onConfirmBuy,
}) => {
  return (
    <Dialog open={!!gift} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Êtes-vous sûr de vouloir acheter cet article ?
          </DialogTitle>
        </DialogHeader>
        <p>
          Vous êtes sur le point de marquer &quot;{gift?.name}&quot; pour &quot;
          {String(gift?.recipient)}&quot; comme acheté.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onConfirmBuy}>Oui, j&apos;ai acheté</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftDialog;
