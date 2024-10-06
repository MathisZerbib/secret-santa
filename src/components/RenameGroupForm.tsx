import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface RenameGroupFormProps {
  groupToRename: { id: number; name: string } | null;
  onClose: () => void;
  onRename: (id: number, newName: string) => Promise<void>;
}

const RenameGroupForm: React.FC<RenameGroupFormProps> = ({
  groupToRename,
  onClose,
  onRename,
}) => {
  const [newGroupName, setNewGroupName] = useState(groupToRename?.name || "");
  const { toast } = useToast();

  const handleRenameGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupToRename) return;

    if (newGroupName.length < 3 || newGroupName.length > 50) {
      toast({
        title: "Erreur",
        description: "Le nom du groupe doit contenir entre 3 et 50 caractères.",
      });
      return;
    }

    try {
      await onRename(groupToRename.id, newGroupName);
      onClose();
      toast({
        title: "Succès",
        description: "Nom du groupe modifié avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors du changement de nom du groupe:", error);
      toast({
        title: "Erreur",
        description: "Échec du changement de nom du groupe.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="backdrop-blur-md bg-white bg-opacity-10 p-8 rounded-xl max-w-md w-full relative shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Renommer le groupe
        </h2>
        <form onSubmit={handleRenameGroup}>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full p-2 border text-white border-gray-300 rounded mb-4 bg-transparent"
            placeholder="Nouveau nom du groupe"
          />
          <Button
            type="submit"
            className="w-full py-2 border-transparent bg-white text-black rounded hover:bg-transparent hover:text-white hover:border hover:border-white transition-colors"
          >
            Renommer
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RenameGroupForm;
