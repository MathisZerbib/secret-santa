"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { SecretSantaGroup } from "@prisma/client";
import CreateGroupForm from "../components/CreateGroupForm";
import { Button } from "../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { FaCopy, FaPlus, FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import HeaderSession from "../components/HeaderSession";
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import RenameGroupForm from "../components/RenameGroupForm";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState<SecretSantaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameGroupForm, setShowRenameGroupForm] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecretSantaGroup | null>(
    null
  );
  const [groupToRename, setGroupToRename] = useState<SecretSantaGroup | null>(
    null
  );
  const [user, setUser] = useState<{ name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.isActive) {
        router.push("/subscription");
      } else {
        setUser({ name: session.user.name ?? "" });
      }
    } else if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-secret-santa-groups`
        );
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des groupes Secret Santa:",
          error
        );
        toast({
          title: "Erreur",
          description: "Échec de la récupération des groupes Secret Santa.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.isActive) {
      fetchGroups();
    }
  }, [status, session, toast]);
  const handleCreateGroup = async (name: string, managerEmail: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, managerEmail }),
        }
      );
      await res.json();

      // Fetch all groups again to get the latest data
      const groupsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-secret-santa-groups`
      );

      const updatedGroups = await groupsRes.json();
      setGroups(updatedGroups);

      setShowCreateForm(false);
      toast({
        title: "Succès",
        description: "Groupe créé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      toast({
        title: "Erreur",
        description: "Échec de la création du groupe.",
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/delete?id=${groupToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.id !== groupToDelete.id)
      );
      setShowDeleteDialog(false);
      toast({
        title: "Succès",
        description: "Groupe supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression du groupe.",
      });
    }
  };

  const handleRenameGroup = async (id: number, newName: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/rename?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === Number(id) ? { ...group, name: newName } : group
        )
      );
      setShowRenameGroupForm(false);
    } catch (error) {
      console.error("Erreur lors du changement de nom du groupe:", error);
      throw error;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Code d'invitation copié dans le presse-papiers!",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={80} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white text-2xl">
          Veuillez vous connecter pour voir cette page
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <HeaderSession />
      <div className="flex-grow flex justify-center items-start py-16 lg:py-12 px-6">
        <div className="flex flex-col justify-center mx-auto p-4 lg:p-8 backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-8 text-center text-white">
            Tableau de bord
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {groups &&
              groups.length > 0 &&
              groups.map((group: SecretSantaGroup) =>
                group.id && group.inviteCode && group.name ? (
                  <div
                    key={group.inviteCode}
                    className="p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 bg-white bg-opacity-20 relative"
                  >
                    <div className="font-bold text-xl lg:text-2xl mb-2 text-center text-white">
                      {group.name}
                    </div>
                    <div className="text-lg text-center text-white mb-2">
                      Code d&rsquo;invitation: {group.inviteCode}
                      <Button
                        onClick={() => copyToClipboard(group.inviteCode)}
                        className="ml-2 p-2 bg-transparent text-white hover:bg-white hover:text-black rounded-full"
                      >
                        <FaCopy />
                      </Button>
                    </div>
                    <Link href={`/group/${group.id}`} passHref>
                      <Button className="w-full mt-4 py-2 bg-white text-black rounded hover:bg-black hover:text-white transition-colors">
                        Voir les cadeaux
                      </Button>
                    </Link>
                    <button
                      onClick={() => {
                        setGroupToRename(group);
                        setShowRenameGroupForm(true);
                      }}
                      className="absolute top-4 left-4 text-white hover:text-yellow-500 focus:outline-none"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => {
                        setGroupToDelete(group);
                        setShowDeleteDialog(true);
                      }}
                      className="absolute top-4 right-4 text-white hover:text-red-500 focus:outline-none"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                ) : null
              )}
            <div
              className="p-4 lg:p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-white bg-opacity-20"
              onClick={() => setShowCreateForm(true)}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <FaPlus className="text-4xl text-white mb-4" />
                <span className="text-xl font-semibold text-white">
                  Créer un nouveau groupe
                </span>
              </div>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-md w-full relative">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 text-black hover:text-gray-700 focus:outline-none"
              >
                <FaTimes className="text-2xl" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-black text-center">
                Créer un nouveau groupe
              </h2>
              <CreateGroupForm onSubmit={handleCreateGroup} />
            </div>
          </div>
        )}

        {showRenameGroupForm && groupToRename && (
          <RenameGroupForm
            groupToRename={{ id: groupToRename.id, name: groupToRename.name }}
            onClose={() => setShowRenameGroupForm(false)}
            onRename={handleRenameGroup}
          />
        )}

        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteGroup}
          message="Êtes-vous sûr de vouloir supprimer ce groupe ?"
        />
      </div>
    </div>
  );
};

export default Dashboard;
