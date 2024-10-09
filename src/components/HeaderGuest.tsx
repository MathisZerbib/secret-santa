import { FC } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

const HeaderGuest: FC = () => {
  const router = useRouter();

  const goBack = (from: string) => {
    switch (from) {
      case "admin":
        router.push("/admin");
        break;
      case "group":
        router.push("/dashboard");
        break;
      default:
        router.push("/app");
        break;
    }
  };

  return (
    <header className="flex flex-col justify-center mx-auto p-8 backdrop-blur-md bg-white bg-opacity-10 shadow-xl overflow-hidden w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Bouton Retour */}
        <button
          onClick={() => {
            goBack(router.pathname.split("/")[1]);
          }}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft className="text-white" />
        </button>

        {/* Logo */}
        <div className="text-2xl font-bold">Secret Santa</div>

        {/* Menu Invité */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage
                src={"/santa-og-1.png"}
                alt={"Invité"}
                className="w-8 h-8 rounded-full"
              />
              <AvatarFallback className="w-8 h-8 bg-white text-black">
                I
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white shadow-lg rounded-lg p-2"
          >
            <DropdownMenuLabel className="text-gray-700 font-semibold">
              Invité
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push("/app")}
              className="cursor-pointer text-gray-700 hover:bg-gray-100 rounded-md p-2"
            >
              Connexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeaderGuest;
