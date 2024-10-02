import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useSession } from "next-auth/react";

interface CreateGroupFormProps {
  onSubmit: (groupName: string, email: string) => Promise<void>;
  onCancel: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [groupName, setGroupName] = useState("");
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(groupName, email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="groupName"
          type="text"
          placeholder="Entrer le nom du groupe"
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 bg-white text-black border border-gray-300 rounded-md placeholder-black placeholder-opacity-75 focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>
      <div className="flex space-x-2">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-3 p-2 bg-white text-black hover:bg-gray-100 transition-all duration-300 rounded-md"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="flex-1 p-2 bg-black text-white hover:bg-opacity-30 transition-all duration-300 rounded-md"
        >
          Créer votre groupe
        </Button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
