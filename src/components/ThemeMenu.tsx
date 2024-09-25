"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

const themes = [
  { name: "Pull Rennes", image: "/w-1.jpeg" },
  { name: "Pull Sapins", image: "/w-2.jpeg" },
  { name: "Chapeau Père Noël", image: "/w-3.jpeg" },
  { name: "Pull Flocons", image: "/w-4.jpeg" },
  { name: "Symboles de Noël", image: "/w-5.jpeg" },
  { name: "Sapins colorés", image: "/w-6.jpeg" },
];

interface ThemesMenuProps {
  setBackgroundImage: (image: string) => void;
}

const ThemesMenu: React.FC<ThemesMenuProps> = ({ setBackgroundImage }) => {
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setBackgroundImage(savedTheme);
      setCurrentTheme(savedTheme);
    }
  }, [setBackgroundImage]);

  const handleThemeChange = (image: string) => {
    setBackgroundImage(image);
    setCurrentTheme(image);
    localStorage.setItem("selectedTheme", image);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="bg-white text-black hover:bg-gray-100 border border-gray-300 shadow-md sm:mr-4 md:mr-8 lg:mr-12"
        >
          Themes
          <FaChevronDown
            className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white mr-8 md:mr-16 lg:mr-20">
        <DropdownMenuLabel>Choose a Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => handleThemeChange(theme.image)}
            className={`flex items-center justify-between cursor-pointer px-4 py-2 ${
              currentTheme === theme.image ? "bg-blue-100 text-blue-600" : ""
            }`}
          >
            {theme.name}
            {currentTheme === theme.image && (
              <span className="text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemesMenu;
