"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";
import { SecretSantaGroup } from "@prisma/client";
import CreateGroupForm from "../components/CreateGroupForm";
import { Button } from "../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { FaCopy, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import HeaderSession from "../components/HeaderSession";
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";

const Dashboard = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<SecretSantaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SecretSantaGroup | null>(
    null
  );
  const [user, setUser] = useState<{ name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      const session = await getSession();
      if (!session) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-white text-2xl">
              Please login to view this page
            </p>
            <Link href="/api/auth/signin" passHref>
              <Button className="text-white">Login</Button>
            </Link>
          </div>
        );
      }
      if (session.user && session.user.name) {
        setUser({ name: session.user.name });
      } else {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-white text-2xl">
              Please login to view this page
            </p>
            <Link href="/api/auth/signin" passHref>
              <Button className="text-white">Login</Button>
            </Link>
          </div>
        );
      }

      try {
        const res = await fetch("/api/get-secret-santa-groups");
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching Secret Santa groups:", error);
        toast({
          title: "Error",
          description: "Failed to fetch Secret Santa groups.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [router, toast]);

  const handleCreateGroup = async (name: string, managerEmail: string) => {
    try {
      const res = await fetch("/api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, managerEmail }),
      });

      const newGroup = await res.json();
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Group created successfully.",
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create group.",
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await fetch(`/api/group/delete?id=${groupToDelete.id}`, {
        method: "DELETE",
      });

      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.id !== groupToDelete.id)
      );
      setShowDeleteDialog(false);
      toast({
        title: "Success",
        description: "Group deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group.",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Invite code copied to clipboard!",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/app");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={80} />
      </div>
    );
  }
  /// return go to login if not logged in

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white text-2xl">Please login to view this page</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <HeaderSession userName={user?.name || ""} onLogout={handleLogout} />
      <div className="flex-grow flex justify-center items-start py-16 lg:py-12 px-6">
        <div className="flex flex-col justify-center mx-auto p-4 lg:p-8 backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-8 text-center text-white">
            Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {groups &&
              groups.length > 0 &&
              groups.map((group: SecretSantaGroup) => (
                <div
                  key={group.inviteCode}
                  className="p-4 lg:p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 bg-white bg-opacity-20 relative"
                >
                  <div className="font-bold text-xl lg:text-2xl mb-2 text-center text-white">
                    {group.name}
                  </div>
                  <div className="text-lg text-center text-white mb-2">
                    Invite Code: {group.inviteCode}
                    <Button
                      onClick={() => copyToClipboard(group.inviteCode)}
                      className="ml-2 p-2 bg-transparent text-white hover:bg-white hover:text-black rounded-full"
                    >
                      <FaCopy />
                    </Button>
                  </div>
                  <Link href={`/group/${group.id}`} passHref>
                    <Button className="w-full mt-4 py-2 bg-white text-black rounded hover:bg-black hover:text-white transition-colors">
                      View Group
                    </Button>
                  </Link>
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
              ))}
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
