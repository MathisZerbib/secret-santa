import React, { FormEvent, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

interface InviteFormProps {
  onSubmit: (inviteCode: string) => Promise<boolean>;
}

const InviteForm: React.FC<InviteFormProps> = ({ onSubmit }) => {
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(inviteCode);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="inviteCode"
          type="text"
          placeholder="Entrer un code d'invitation"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
          className="w-full p-2 bg-white bg-opacity-20 border-none text-white placeholder-white placeholder-opacity-75 focus:ring-2 focus:ring-white placeholder:text-white"
        />
        <Button
          type="submit"
          className="w-full p-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-300"
        >
          Rejoindre
        </Button>
      </form>
      <p className="text-center text-white mt-4">Or</p>
    </div>
  );
};

export default InviteForm;
