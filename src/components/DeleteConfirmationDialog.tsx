import React from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "../components/ui/button";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-700 focus:outline-none"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          {message}
        </h2>
        <div className="flex justify-between">
          <Button
            onClick={onClose}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
