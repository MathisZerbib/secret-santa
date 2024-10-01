import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { SecretSantaGroup } from "@prisma/client";
import CreateGroupForm from "../components/CreateGroupForm";
import { Button } from "../components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ThemesMenu from "@/components/ThemeMenu";
import Link from "next/link"; // Import Link component
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";

const Dashboard = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<SecretSantaGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // const setBackgroundImage = (image: string) => {
  //   document.body.style.backgroundImage = `url(${image})`;
  //   localStorage.setItem("selectedTheme", image);
  // };

  useEffect(() => {
    const fetchGroups = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/api/auth/signin");
        return;
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

  const cancelSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/subscription-cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { subscription } = await res.json();
      console.log(subscription);
      router.push("/subscription");
      toast({
        title: "Success",
        description: "Subscription cancelled successfully.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription.",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center h-screen">
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas>
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
      </div>
      <div className="flex flex-col justify-center mx-auto p-4 backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
        <Button
          onClick={cancelSubscription}
          className="mb-6 px-4 py-2 bg-red-500 text-white rounded mx-auto block"
        >
          Cancel Subscription
        </Button>
        <CreateGroupForm onSubmit={handleCreateGroup} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {groups.map((group: SecretSantaGroup) => (
            <div
              key={group.id}
              className="p-6 border border-gray-300 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="font-bold text-2xl mb-2 text-center text-white">
                {group.name}
              </div>
              <div className="text-lg text-center text-white mb-2">
                Nom du groupe: {group.name}
              </div>
              <div className="text-lg text-center text-white mb-2">
                Invite Code: {group.inviteCode}
              </div>
              <Link href={`/group/${group.id}`} passHref>
                <Button className="w-full mt-2 py-2 bg-white text-black rounded hover:bg-black hover:text-white">
                  View Group
                </Button>
              </Link>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(group.inviteCode);
                }}
                className="w-full mt-2 py-2 bg-black text-white rounded"
              >
                Copy Invite Code
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
