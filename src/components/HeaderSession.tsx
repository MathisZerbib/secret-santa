// components/HeaderSession.tsx
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
import GoBackBtn from "@/components/GoBackBtn"; // Import GoBackBtn

const HeaderSession: FC = () => {
  const { data: session } = useSession();
  const [isManageSubscriptionOpen, setIsManageSubscriptionOpen] =
    useState(false);
  const [isManager, setIsManager] = useState(false);
  const router = useRouter();
  const openManageSubscription = () => setIsManageSubscriptionOpen(true);
  const closeManageSubscription = () => setIsManageSubscriptionOpen(false);

  useEffect(() => {
    if (
      router.pathname.includes("/group") ||
      router.pathname.includes("/admin") ||
      router.pathname.includes("/dashboard")
    ) {
      const checkIfManager = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/check-manager`
        );
        const data = await response.json();
        setIsManager("isManager" in data ? data.isManager : false);
      };
      if (session) {
        checkIfManager();
        console.log(session?.user?.image);
      }
    }
  }, [router.pathname, session]);

  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image || "/santa-og-1.png";

  const getPageName = (path: string) => {
    switch (path) {
      case "admin":
        return "Espace Administrateur";

      case "dashboard":
        return "Tableau de bord";

      case "group":
        return "Groupe";

      default:
        return "Secret Santa";
    }
  };

  return (
    <header className="flex flex-col justify-center mx-auto p-8 backdrop-blur-md bg-white bg-opacity-10 shadow-xl overflow-hidden w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Back Button */}
        <GoBackBtn />

        {/* Logo */}
        <div className="text-2xl font-bold">
          {getPageName(router.pathname.split("/")[1] || "")}
        </div>

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
