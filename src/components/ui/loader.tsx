// components/Loader.tsx
import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, color = "#ffffff" }) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ overflow: "visible" }}
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, rotate: 360 }}
          transition={{
            pathLength: { type: "spring", duration: 1.5, bounce: 0 },
            rotate: { duration: 2, ease: "linear", repeat: Infinity },
          }}
        />
      </svg>
    </div>
  );
};

export default Loader;
