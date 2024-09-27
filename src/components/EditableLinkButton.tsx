import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaEye, FaLink } from "react-icons/fa";

interface EditableLinkButtonProps {
  initialLink: string;
  onSave: (newLink: string) => void;
}

const EditableLinkButton: React.FC<EditableLinkButtonProps> = ({
  initialLink,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [link, setLink] = useState(initialLink);

  const handleSave = () => {
    onSave(link);
    setIsEditing(false);
  };

  return (
    <>
      {initialLink ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(initialLink, "_blank")}
          className="mr-2 text-black"
        >
          <FaEye />
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="text-black"
      >
        <FaLink />
      </Button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">
              {initialLink ? "Modifier le lien" : "Ajouter un lien"}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Entrez le lien de l'article"
            className="text-black"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="text-black"
            >
              Annuler
            </Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditableLinkButton;
