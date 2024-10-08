"use client";

import "../app/globals.css";
import React, { useState } from "react";
import { useRouter } from "next/router";
import InviteForm from "../components/InviteForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import Provider from "@/components/provider";
import LoginBtn from "@/components/LoginBtn";

function App() {
  const router = useRouter();
  const [view] = useState<"join" | "create" | "main">("join");
  const [inviteCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidInviteCode, setIsValidInviteCode] = useState(false);
  // const [showGradient, setShowGradient] = useState(true);

  const handleInviteSubmit = async (inviteCode: string) => {
    // setIsLoading(true);
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
      setSuccessMessage("Code d'invitation valide");

      // Redirect to the group page
      const data = await response.json();
      router.push(`/group/${data.groupId}?inviteCode=${inviteCode}`);

      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      return false;
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <Provider>
      <div className="relative min-h-screen overflow-hidden">
        {/* Main content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="mx-auto max-w-md w-full">
            <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden">
              {isValidInviteCode ? (
                <></>
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

export default App;
