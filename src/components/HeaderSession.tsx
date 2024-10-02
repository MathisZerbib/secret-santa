import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderSessionProps {
  userName: string;
  userImage?: string;
  onLogout: () => void;
}

const HeaderSession: FC<HeaderSessionProps> = ({
  userName,
  userImage,
  onLogout,
}) => {
  return (
    <header className="flex flex-col justify-center mx-auto p-8 backdrop-blur-md bg-white bg-opacity-10 shadow-xl overflow-hidden w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">Secret Santa </div>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                {userImage ? (
                  <AvatarImage src={userImage} alt={userName} />
                ) : (
                  <AvatarFallback>{userName[0]}</AvatarFallback>
                )}
              </Avatar>
            </Button>
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
              onClick={() => {
                // Navigate to user profile page
              }}
              className="cursor-pointer"
            >
              Abonnement
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
    </header>
  );
};

export default HeaderSession;
