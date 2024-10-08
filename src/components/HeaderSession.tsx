import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ManageSubscription from "@/components/ManageSubscription";
import AdminSpace from "./AdminSpace";
import { Recipient } from "@prisma/client";

interface HeaderSessionProps {
  userName: string;
  userImage?: string;
  isManager?: boolean;
  secretSantaGroupId?: number;
  onLogout: () => void;
}

const HeaderSession: FC<HeaderSessionProps> = ({
  userName,
  userImage,
  isManager,
  secretSantaGroupId,
  onLogout,
}) => {
  const [isManageSubscriptionOpen, setIsManageSubscriptionOpen] =
    useState(false);

  const openManageSubscription = () => setIsManageSubscriptionOpen(true);
  const closeManageSubscription = () => setIsManageSubscriptionOpen(false);

  const handleAddRecipient = async (recipient: Recipient) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipients/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...recipient, secretSantaGroupId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add recipient");
      }
      const newRecipient = await response.json();
      console.log("New recipient added:", newRecipient);
    } catch (error) {
      console.error("Error adding recipient:", error);
      throw error;
    }
  };

  const organizeSecretSanta = async (email: string, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/secret-santa/organize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to organize Secret Santa");
      }
      alert("Secret Santa organized successfully!");
    } catch (error) {
      console.error("Error organizing Secret Santa:", error);
      throw error;
    }
  };

  return (
    <header className="flex flex-col justify-center mx-auto p-8 backdrop-blur-md bg-white bg-opacity-10 shadow-xl overflow-hidden w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">Secret Santa</div>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="w-8 h-8">
                {userImage ? (
                  <AvatarImage
                    src={userImage}
                    alt={userName}
                    className="w-8 h-8"
                  />
                ) : (
                  <AvatarFallback
                    className="w-8 h-8 bg-white text-black"
                    aria-label={userName}
                  >
                    {userName[0]}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // Navigate to user profile page
              }}
              className="cursor-pointer"
            >
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openManageSubscription}
              className="cursor-pointer"
            >
              Abonnement
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AdminSpace
                onAddRecipient={handleAddRecipient}
                onOrganizeSecretSanta={organizeSecretSanta}
                isOpen={false}
                onClose={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              {isManager && <p>Admin Space</p>}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-red-500"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ManageSubscription
        isOpen={isManageSubscriptionOpen}
        onClose={closeManageSubscription}
      />
    </header>
  );
};

export default HeaderSession;
