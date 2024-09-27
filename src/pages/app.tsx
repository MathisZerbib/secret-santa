// pages/index.tsx or app/page.tsx (depending on your Next.js version)

"use client";
import "../app/globals.css";
import { useState, useEffect } from "react";
import MainContent from "../components/MainContent";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Gift } from "@/types/gift";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

const getGifts = async (): Promise<Gift[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/get`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch gifts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return [];
  }
};

const initializeManager = async (email: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/manager/init`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to initialize app manager");
    }

    const data = await response.json();
    localStorage.setItem("managerToken", data.token);
    return data.token;
  } catch (error) {
    console.error("Error initializing app manager:", error);
    throw error;
  }
};

export default function App() {
  const [isManagerSet, setIsManagerSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [managerEmail, setManagerEmail] = useState("");
  const [initialGifts, setInitialGifts] = useState<Gift[]>([]);

  useEffect(() => {
    const checkManager = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/manager/get`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Manager data:", data);
          if (data[0]) {
            setIsManagerSet(true);
            const giftsData = await getGifts();
            setInitialGifts(giftsData);
          }
        }
      } catch (error) {
        console.error("Error checking manager:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkManager();
  }, []);

  const handleManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await initializeManager(managerEmail);
      setIsManagerSet(true);
      const giftsData = await getGifts();
      setInitialGifts(giftsData);
    } catch (error) {
      console.error("Failed to set manager:", error);
      alert("Failed to set manager. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center">
        <Loader size={80} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {isManagerSet ? (
        <>
          <MainContent initialGifts={initialGifts} />
        </>
      ) : (
        <Card className="bg-white w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/4 mx-auto">
          <CardHeader>
            <CardTitle>Créez un manager de secret santa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManagerSubmit}>
              <input
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="Entrez l'email du manager"
                required
                className="w-full p-2 border rounded"
              />
              <Button
                type="submit"
                className="mt-2 p-2 bg-black text-white w-full"
                variant="outline"
              >
                Créer le manager
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
