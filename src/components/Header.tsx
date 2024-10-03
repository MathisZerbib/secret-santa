"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-colors duration-300 ${
        isScrolled ? "bg-black bg-opacity-80" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Secret Santa Pro
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            href="#home"
            className="text-white hover:text-gray-300 transition"
          >
            Accueil
          </Link>
          <Link
            href="#features"
            className="text-white hover:text-gray-300 transition"
          >
            Fonctionnalités
          </Link>
          <Link
            href="#newsletter"
            className="text-white hover:text-gray-300 transition"
          >
            Newsletter
          </Link>

          <Button
            asChild
            variant={isScrolled ? "outline" : "default"}
            className="text-orange-500 border border-transparent bg-white hover:bg-transparent hover:text-white hover:border hover:border-white"
          >
            <Link href="/app">Rejoindre</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
