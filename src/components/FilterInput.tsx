import React from "react";
import { Input } from "./ui/input";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface FilterInputProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  isFilterExpanded: boolean;
  onToggleFilter: () => void;
}

const FilterInput: React.FC<FilterInputProps> = ({
  filter,
  onFilterChange,
  isFilterExpanded,
  onToggleFilter,
}) => {
  return (
    <div className="flex items-center mb-4 justify-en">
      <div className="flex-grow">
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Filtrer par nom ou destinataire"
                className="w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleFilter}
        className="ml-2 flex-shrink-0"
      >
        <FaFilter />
      </Button>
    </div>
  );
};

export default FilterInput;
