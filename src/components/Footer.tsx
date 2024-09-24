// components/Footer.tsx
import Image from "next/image";
import styles from "./Footer.module.css";
import React from "react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyrightContainer}>
        <Image
          src={"/zer_logo.webp"}
          alt="Copyright Logo"
          width={50}
          height={50}
          className={styles.copyrightImage}
        />
        <p>© 2024 Mathis Zerbib. All rights reserved.</p>
      </div>
    </footer>
  );
}
