import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { SecretSantaGroup } from "@prisma/client";
import CreateGroupForm from "../components/CreateGroupForm";
import { Button } from "../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
// import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import { FaCopy, FaPlus } from "react-icons/fa";
import HeaderSession from "../components/HeaderSession";
import Loader from "@/components/ui/loader";

const Dashboard = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<SecretSantaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/api/auth/signin");
        return;
      }
      if (session.user) {
        setUser({ name: session.user.name ?? "" });
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Invite code copied to clipboard!",
    });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/signout");
    router.push("/api/auth/signin");
  };

  if (loading) {
    return <Loader size={40} />;
  }

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/bg.png')",
        backdropFilter: "blur(10px)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <HeaderSession userName={user?.name || ""} onLogout={handleLogout} />
      <div className="flex-grow flex justify-center items-center py-12">
        {/* <div className="absolute inset-0 z-auto"> */}
        {/* <ShaderGradientCanvas>
            <ShaderGradient
              control="query"
              urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
            />
          </ShaderGradientCanvas> */}
        {/* </div> */}
        <div className="flex flex-col justify-center mx-auto p-8 backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">
            Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: SecretSantaGroup) => (
              <div
                key={group.id}
                className="p-6 border border-gray-300 rounded-xl shadow-lg transition-transform transform hover:scale-105 bg-white bg-opacity-20"
              >
                <div className="font-bold text-2xl mb-2 text-center text-white">
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
              </div>
            ))}
            <div
              className="p-6 border border-gray-300 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-white bg-opacity-20"
              onClick={() => setShowCreateForm(true)}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <FaPlus className="text-4xl text-white mb-4" />
                <span className="text-xl font-semibold text-white">
                  Create New Group
                </span>
              </div>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
              <CreateGroupForm onSubmit={handleCreateGroup} />
              <Button
                onClick={() => setShowCreateForm(false)}
                className="mt-4 w-full bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
