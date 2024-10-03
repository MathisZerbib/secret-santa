"use client";

import "../app/globals.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainContent from "../components/MainContent";
import InviteForm from "../components/InviteForm";
import { Gift } from "../types/gift";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Loader from "@/components/ui/loader";
// import { Button } from "@/components/ui/button";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import Provider from "@/components/provider";
import LoginBtn from "@/components/LoginBtn";

const getGifts = async (groupId?: string): Promise<Gift[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/get?groupId=${groupId}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch gifts");
    }
    const gifts = await response.json();
    return gifts.map((gift: Gift) => ({
      ...gift,
      recipient: gift.recipient,
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
  const [view] = useState<"join" | "create" | "main">("join");
  const [inviteCode] = useState("");
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
        throw new Error(errorData.error || "Code d'invitation invalide");
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

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <Loader size={80} />
      </div>
    );
  }

  return (
    <Provider>
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
                        <div className="flex justify-center">
                          <LoginBtn />
                        </div>
                      </>
                    ) : (
                      <></>
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
    </Provider>
  );
}
