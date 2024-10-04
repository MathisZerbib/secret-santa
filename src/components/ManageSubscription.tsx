import { FC } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import CancelSubscription from "./CancelSubscription";
import { Tooltip } from "./ui/tooltip";
import { FaTimes } from "react-icons/fa";

interface ManageSubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageSubscription: FC<ManageSubscriptionProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="loader mb-4"></div>
            <p>Chargement...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;
  const trialEndDate = user?.subscriptionID;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col space-y-4 p-8">
        <DialogTitle className="text-2xl font-bold mb-4 text-black">
          Gérez votre abonnement
        </DialogTitle>
        <DialogDescription className="mb-4">
          Consultez les détails de votre abonnement et les informations de votre
          profil.
        </DialogDescription>
        <div className="mb-4 space-y-2">
          <div className="flex items-center">
            <strong className="w-1/3 text-black">Nom du profil :</strong>
            <span className="text-black">{user?.name || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-1/3 text-black">Email :</strong>
            <span className="text-black">{user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-1/3 text-black">Plan :</strong>
            <span className="text-black">{user?.subscriptionID || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-1/3 text-black">
              Fin de l'essai gratuit :
            </strong>
            <span className="text-black">{trialEndDate}</span>
          </div>
        </div>
        <CancelSubscription />
      </DialogContent>
    </Dialog>
  );
};

export default ManageSubscription;
