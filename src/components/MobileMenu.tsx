"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "100vh",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="md:hidden">
      <button onClick={toggleMenu} className="p-2 z-50 relative">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col justify-center items-center"
          >
            <nav className="flex flex-col space-y-10 text-white text-center">
              <Link
                href="#features"
                onClick={toggleMenu}
                className="text-3xl font-semibold hover:text-orange-500 transition"
              >
                Features
              </Link>
              <Link
                href="#newsletter"
                onClick={toggleMenu}
                className="text-3xl font-semibold hover:text-orange-500 transition"
              >
                Newsletter
              </Link>
              <Link
                href="/app"
                onClick={toggleMenu}
                className="text-3xl font-bold hover:text-orange-500 transition"
              >
                Essayez Maintenant
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
