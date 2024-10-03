import React from "react";
import { Button } from "./ui/button";
import EditableLinkButton from "./EditableLinkButton";
import { motion } from "framer-motion";
import { Gift } from "../types/gift";

interface GiftItemProps {
  gift: Gift;
  onUpdateLink: (id: number, newLink: string) => void;
  onConfirmBuy: (gift: Gift) => void;
}

const GiftItem: React.FC<GiftItemProps> = ({
  gift,
  onUpdateLink,
  onConfirmBuy,
}) => {
  return (
    <motion.li
      className={`flex justify-between items-center p-3 rounded ${
        gift.bought ? "bg-gray-100 text-gray-500" : "bg-white"
      }`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-grow">
        <span className={gift.bought ? "line-through" : ""}>{gift.name}</span>
        <span className="ml-2 text-sm text-white">
          (Pour : {gift.recipient && gift.recipient.name})
        </span>
      </div>
      <div className="flex items-center">
        <EditableLinkButton
          initialLink={gift.link || ""}
          onSave={(newLink) => onUpdateLink(gift.id, newLink)}
        />
        {!gift.bought && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConfirmBuy(gift)}
            className="ml-2"
          >
            Acheter
          </Button>
        )}
      </div>
    </motion.li>
  );
};

export default GiftItem;
