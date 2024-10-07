import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GiftForm from "./GiftForm";
import GiftList from "./GiftList";
import FilterInput from "./FilterInput";
// import ThemesMenu from "./ThemeMenu";
import { Recipient } from "@prisma/client";
import React from "react";
import { Gift } from "@/types/gift";
import AdminSpace from "./AdminSpace";
import { motion } from "framer-motion";

interface MainContentProps {
  initialGifts: Gift[];
}

function MainContent({ initialGifts }: MainContentProps) {
  const router = useRouter();
  const [gifts, setGifts] = useState(initialGifts);
  const [filter, setFilter] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [secretSantaGroupId, setSecretSantaGroupId] = useState(Number);

  // Extract secretSantaGroupId from the query URL
  useEffect(() => {
    const { id } = router.query;
    if (typeof id === "string") {
      setSecretSantaGroupId(Number(id));
    }
  }, [router.query, setSecretSantaGroupId]);

  // const setBackgroundImage = (image: string) => {
  //   document.body.style.backgroundImage = `url(${image})`;
  //   localStorage.setItem("selectedTheme", image);
  // };

  const handleAddRecipient = async (recipient: Recipient) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipients/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...recipient, secretSantaGroupId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add recipient");
      }
      const newRecipient = await response.json();
      console.log("New recipient added:", newRecipient);
    } catch (error) {
      console.error("Error adding recipient:", error);
      throw error;
    }
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
            secretSantaGroupId: secretSantaGroupId,
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

  const deleteGift = async (id: number) => {
    setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== id));
  };

  const organizeSecretSanta = async (email: string, token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/secret-santa/organize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to organize Secret Santa");
      }
      alert("Secret Santa organized successfully!");
    } catch (error) {
      console.error("Error organizing Secret Santa:", error);
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-4 right-4 z-50"
      >
        {/* <ThemesMenu setBackgroundImage={setBackgroundImage} /> */}
        <div className="relative z-50">
          <AdminSpace
            onAddRecipient={handleAddRecipient}
            onOrganizeSecretSanta={organizeSecretSanta}
          />
        </div>
      </motion.div>
      <br />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-2xl mx-auto p-6 rounded-lg shadow-md mt-16 sm:mt-8"
      >
        <h2 className="text-xl font-semibold text-white">
          Ajouter votre souhait de cadeau
        </h2>
        {/* /Add a text that display the limit of € to wish gift/ */}
        <span className="text-white italic">20€ maximum</span>
        <GiftForm onAddGift={addGift} secretSantaGroupId={secretSantaGroupId} />
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
            onDeleteGift={deleteGift}
          />
        ) : (
          <p> Commencez à ajouter des cadeaux !</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default MainContent;
