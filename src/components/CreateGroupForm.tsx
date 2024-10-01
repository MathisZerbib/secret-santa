import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface CreateGroupFormProps {
  onSubmit: (groupName: string, email: string) => Promise<void>;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onSubmit }) => {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");

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
          className="w-full p-2 bg-white bg-opacity-20 border-none text-white placeholder:text-white placeholder-opacity-75 focus:ring-2 focus:ring-white"
        />
      </div>
      <div>
        <Input
          id="email"
          type="email"
          placeholder="Entrer votre email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-white bg-opacity-20 border-none text-white placeholder:text-white placeholder-opacity-75 focus:ring-2 focus:ring-white"
        />
      </div>

      <Button
        type="submit"
        className="w-full p-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-300"
      >
        Créer un groupe
      </Button>
    </form>
  );
};

export default CreateGroupForm;
