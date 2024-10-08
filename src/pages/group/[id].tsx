import "../../app/globals.css";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainContent from "../../components/MainContent";
import Loader from "../../components/ui/loader";
import { Gift } from "../../types/gift";
import HeaderSession from "@/components/HeaderSession";
import { useSession } from "next-auth/react";
import HeaderGuest from "@/components/HeaderGuest";

interface Group {
  id: string;
  name: string;
}

const getGroupDetails = async (groupId: string): Promise<Group | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/get?groupId=${groupId}`
    );

    if (!response.ok) {
      return null;
    }

    const group = await response.json();
    return group;
  } catch (error) {
    console.error("Error fetching group details:", error);
    return null;
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
  const { id, inviteCode } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      const fetchGroupAndGifts = async () => {
        const groupDetails = await getGroupDetails(id as string);
        if (!groupDetails) {
          router.push("/app");
          console.error("Group does not exist");
          return;
        }

        setGroup(groupDetails);

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
    <div className="relative min-h-screen flex flex-col">
      {session ? <HeaderSession /> : <HeaderGuest />}

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden p-6">
            <MainContent
              initialGifts={gifts}
              inviteCode={typeof inviteCode === "string" ? inviteCode : ""}
              groupName={group?.name || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
