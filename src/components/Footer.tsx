// components/Footer.tsx
import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black py-8 px-4">
      <div className="container mx-auto flex items-center justify-center">
        <Image
          src="/zer_logo.webp"
          alt="Copyright Logo"
          width={20}
          height={50}
          className="mr-4 rounded-full"
        />
        <p className="text-gray-400">
          © 2024 Mathis Zerbib. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
