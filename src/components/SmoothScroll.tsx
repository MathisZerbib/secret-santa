// SmoothScroll.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1 });
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    handleResize(); // Set the initial height

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [contentRef, children]);

  const y = useTransform(smoothProgress, (value) => {
    return value * -(contentHeight - window.innerHeight);
  });

  return (
    <>
      <div style={{ height: contentHeight }} />
      <motion.div className="scrollBody" style={{ y }} ref={contentRef}>
        {children}
      </motion.div>
    </>
  );
}
