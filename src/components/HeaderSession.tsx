import { FC, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ManageSubscription from "@/components/ManageSubscription";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut
import { FaArrowLeft } from "react-icons/fa";

const HeaderSession: FC = () => {
  const { data: session } = useSession(); // Use useSession to get session data
  const [isManageSubscriptionOpen, setIsManageSubscriptionOpen] =
    useState(false);
  const [isManager, setIsManager] = useState(false);
  const router = useRouter();
  const openManageSubscription = () => setIsManageSubscriptionOpen(true);
  const closeManageSubscription = () => setIsManageSubscriptionOpen(false);

  useEffect(() => {
    const checkIfManager = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/check-manager`
      );
      const data = await response.json();
      setIsManager(data.isManager);
    };
    if (session) {
      checkIfManager();
      console.log(session?.user?.image);
    }
  }, [session]);

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

  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image || "/santa-og-1.png";

  return (
    <header className="flex flex-col justify-center mx-auto p-8 backdrop-blur-md bg-white bg-opacity-10 shadow-xl overflow-hidden w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Back Button */}
        <button
          onClick={() => {
            goBack(router.pathname.split("/")[1]);
          }}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft className=" text-white" />
        </button>

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
            {isManager && (
              <DropdownMenuItem
                onClick={() => {
                  // Navigate to admin
                  router.push("/admin");
                }}
                className="cursor-pointer"
              >
                Espace Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                signOut({
                  callbackUrl: "/app",
                })
              }
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
