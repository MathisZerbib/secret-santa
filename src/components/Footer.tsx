import Image from "next/image";
import React from "react";

export default function Footer({ className = "" }) {
  return (
    <footer className={`bg-black py-8 px-4 ${className}`}>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center md:flex-row md:items-start mb-4">
          <Image
            src="/zer_logo.webp"
            alt="Copyright Logo"
            width={48}
            height={48}
            className="rounded-full object-cover mb-4 md:mb-0 md:mr-4"
          />
          <p className="text-gray-400 text-center md:text-left">
            © 2024 Mathis Zerbib. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </a>
          <a
            href={`mailto:${
              process.env.SENDGRID_FROM_EMAIL || "mathis.zerbib@epitech.eu"
            }`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
