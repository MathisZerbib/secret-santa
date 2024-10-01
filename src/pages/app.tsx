"use client";

import "../app/globals.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainContent from "../components/MainContent";
import InviteForm from "../components/InviteForm";
import CreateGroupForm from "../components/CreateGroupForm";
import { Gift } from "../types/gift";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";

const getGifts = async (groupId?: string): Promise<Gift[]> => {
  try {
    const url = groupId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/get?groupId=${groupId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/get`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch gifts");
    }
    const gifts = await response.json();
    return gifts.map((gift: Gift) => ({
      ...gift,
      recipient: gift.recipient || { id: 0, name: "Unknown" },
    }));
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return [];
  }
};

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [initialGifts, setInitialGifts] = useState<Gift[]>([]);
  const [view, setView] = useState<"join" | "create" | "main">("join");
  const [inviteCode, setInviteCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidInviteCode, setIsValidInviteCode] = useState(false);
  const [showGradient, setShowGradient] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/status`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("User status:", data);
          const giftsData = await getGifts();
          setInitialGifts(giftsData);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleInviteSubmit = async (inviteCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/group/validate-invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid invite code");
      }

      setIsValidInviteCode(true);
      const giftsData = await getGifts(inviteCode);
      setInitialGifts(giftsData);
      setSuccessMessage("Valid invite code. You can now view the gifts.");
      setShowGradient(false);

      // Redirect to the group page
      router.push(`/group/${inviteCode}`);

      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (groupName: string, email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/group/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          managerEmail: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create group");
      }

      const result = await response.json();

      if (result.inviteCode) {
        setInviteCode(result.inviteCode);
        setSuccessMessage("Secret Santa group created successfully!");
        setView("main");
        setShowGradient(false);

        // Redirect to the group page
        router.push(`/group/${result.inviteCode}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <Loader size={80} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shader background */}
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas
          className={showGradient ? "opacity-100" : "opacity-0"}
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="mx-auto max-w-md w-full">
          <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden">
            {isValidInviteCode ? (
              <MainContent initialGifts={initialGifts} />
            ) : (
              <Card className="bg-transparent border-none">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-bold text-center">
                    Secret Santa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {view === "join" ? (
                    <>
                      <InviteForm onSubmit={handleInviteSubmit} />
                      <Button
                        onClick={() => setView("create")}
                        className="w-full mt-4 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-300"
                      >
                        Créer un groupe
                      </Button>
                    </>
                  ) : (
                    <CreateGroupForm onSubmit={handleCreateGroup} />
                  )}
                  {successMessage && (
                    <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
                      {successMessage}
                      {inviteCode && (
                        <p>Code d&apos;invitation: {inviteCode}</p>
                      )}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
                      {errorMessage}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
