import "../../app/globals.css";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainContent from "../../components/MainContent";
import Loader from "../../components/ui/loader";
import { Gift } from "../../types/gift";
import HeaderSession from "@/components/HeaderSession";
import { useSession } from "next-auth/react";
import HeaderGuest from "@/components/HeaderGuest";

const checkGroupExists = async (groupId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/get?groupId=${groupId}`
    );

    if (!response.ok) {
      return false;
    }

    const group = await response.json();
    return !!group;
  } catch (error) {
    console.error("Error checking group existence:", error);
    return false;
  }
};

const getGiftsByGroupId = async (groupId: string): Promise<Gift[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/get?groupId=${groupId}`
    );
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

const GroupPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      const fetchGroupAndGifts = async () => {
        const groupExists = await checkGroupExists(id as string);
        if (!groupExists) {
          router.push("/app");
          console.error("Group does not exist");
          return;
        }

        const giftsData = await getGiftsByGroupId(id as string);
        setGifts(giftsData);
        setIsLoading(false);
      };
      fetchGroupAndGifts();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <Loader size={80} color="white" />
      </div>
    );
  }

  return (
    <div>
      {session ? <HeaderSession /> : <HeaderGuest />}

      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="mx-auto max-w-2xl w-full">
            <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden">
              <MainContent initialGifts={gifts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
