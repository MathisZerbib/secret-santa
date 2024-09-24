"use client";

import { useState, useEffect } from "react";
import GiftForm from "@/components/GiftForm";
import GiftList from "@/components/GiftList";
import FilterInput from "@/components/FilterInput";
import GiftDialog from "@/components/GiftDialog";
import ThemesMenu from "@/components/ThemeMenu";
import { Gift } from "@/types/gift";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Fetch gifts from the API
const getGifts = async () => {
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

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filter, setFilter] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  // Load the initial data and theme
  useEffect(() => {
    const loadInitialData = async () => {
      const giftsData: Gift[] = await getGifts();
      setGifts(giftsData);
    };

    const loadTheme = () => {
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("selectedTheme");
        if (savedTheme) {
          setBackgroundImage(savedTheme);
        }
      }
    };

    loadInitialData();
    loadTheme();
  }, []);

  // Set background image based on theme selection
  const setBackgroundImage = (image: string) => {
    document.body.style.backgroundImage = `url(${image})`;
    localStorage.setItem("selectedTheme", image);
  };

  // Add a new gift to the list
  const addGift = async (
    newGift: string,
    recipientName: string,
    recipientEmail: string,
    giftLink: string
  ) => {
    if (
      newGift.trim() === "" ||
      recipientEmail.trim() === "" ||
      recipientName.trim() === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            giftName: newGift,
            recipientName: recipientName,
            recipientEmail: recipientEmail,
            link: giftLink,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add gift");
      }
      const newGiftData = await response.json();
      setGifts((prevGifts) => [...prevGifts, newGiftData]);
    } catch (error) {
      console.error("Error adding gift:", error);
      alert("An error occurred while adding the gift. Please try again later.");
    }
  };

  // Update the link for a gift
  const updateGiftLink = async (id: number, newLink: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, link: newLink }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update gift link");
      }
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift.id === id ? { ...gift, link: newLink } : gift
        )
      );
    } catch (error) {
      console.error("Error updating gift link:", error);
      alert("An error occurred while updating the gift link.");
    }
  };

  // Update the name for a gift
  const updateGiftName = async (id: number, newName: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/rename`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, name: newName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update gift name");
      }
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift.id === id ? { ...gift, name: newName } : gift
        )
      );
    } catch (error) {
      console.error("Error updating gift name:", error);
      alert("An error occurred while updating the gift name.");
    }
  };

  // Confirm buying a gift (show dialog)
  const confirmBuyGift = (gift: Gift) => setSelectedGift(gift);

  // Handle buying a gift
  const buyGift = async () => {
    if (selectedGift) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gifts/buy`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedGift.id }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to buy gift");
        }
        setGifts((prevGifts) =>
          prevGifts.map((gift) =>
            gift.id === selectedGift.id ? { ...gift, bought: true } : gift
          )
        );
        setSelectedGift(null);
      } catch (error) {
        console.error("Error buying gift:", error);
        alert("An error occurred while buying the gift.");
      }
    }
  };

  // Delete a gift from the list
  const deleteGift = async (id: number) => {
    setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="absolute top-4 right-4">
        <ThemesMenu setBackgroundImage={setBackgroundImage} />
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg bg-white rounded-lg border border-gray-300">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              🎄 Liste de Cadeaux de Noël 🎁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GiftForm onAddGift={addGift} />
            <FilterInput
              filter={filter}
              onFilterChange={setFilter}
              isFilterExpanded={isFilterExpanded}
              onToggleFilter={() => setIsFilterExpanded(!isFilterExpanded)}
            />
            {gifts.length > 0 ? (
              <GiftList
                gifts={gifts}
                filter={filter}
                onUpdateLink={updateGiftLink}
                onUpdateName={updateGiftName}
                onConfirmBuy={confirmBuyGift}
                onDeleteGift={deleteGift}
              />
            ) : (
              <p className="text-center text-gray-600 mt-4">No gifts found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <GiftDialog
        gift={selectedGift}
        onClose={() => setSelectedGift(null)}
        onConfirmBuy={buyGift}
      />
    </div>
  );
}
