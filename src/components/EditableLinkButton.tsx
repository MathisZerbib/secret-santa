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
          className="mr-2"
        >
          <FaEye />
        </Button>
      ) : null}
      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
        <FaLink />
      </Button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initialLink ? "Modifier le lien" : "Ajouter un lien"}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Entrez le lien de l'article"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
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
