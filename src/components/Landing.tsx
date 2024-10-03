"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import FeatureSection from "./FeatureSection";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import { Globals } from "@react-spring/shared";
import CallToActionSection from "./CallToActionSection";
import Header from "./Header"; // Import the new Header component

const Landing: React.FC = () => {
  Globals.assign({
    frameLoop: "always",
  });

  const targetRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto" id="home">
      {/* ShaderGradient Background */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)" }} // Start blurred
        animate={{ opacity: 1, filter: "blur(0px)" }} // Transition to clear
        transition={{
          // slow then fast fade in opacity
          opacity: { duration: 3.5, ease: "easeInOut" }, // Opacity takes 4s
          filter: { duration: 1, ease: [0.42, 0, 0.58, 1] }, // Blur takes 1s, fast easing
        }}
        className="fixed inset-0 z-0"
      >
        <ShaderGradientCanvas
          style={{
            position: "absolute",
            top: 0,
          }}
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)" }} // Start content blurred
        animate={{ opacity: 1, filter: "blur(0px)" }} // Transition to clear
        transition={{
          opacity: { duration: 1.5, ease: "easeInOut" }, // Opacity takes 1.5s
          filter: { duration: 1, ease: [0.42, 0, 0.58, 1] }, // Blur takes 1s
        }}
        className="relative z-10"
      >
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <motion.section
          ref={targetRef}
          className={`relative ${
            isLandscape ? "min-h-screen" : "h-screen"
          } flex items-center justify-center overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
            {/* Background image or other components */}
          </motion.div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              className={`${
                isLandscape ? "text-4xl md:text-5xl" : "text-6xl md:text-7xl"
              } font-extrabold mb-6`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Secret Santa Réinventé
            </motion.h1>
            <motion.p
              className={`${
                isLandscape ? "text-lg" : "text-xl"
              } mb-8 max-w-2xl mx-auto`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Simplifiez l&apos;organisation de vos événements Cadeau Secret
              avec notre plateforme innovante et sécurisée.
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size={isLandscape ? "default" : "lg"}
                className="text-orange-500 border border-transparent bg-white hover:bg-transparent hover:text-white hover:border hover:border-white"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Découvrir maintenant
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <FeatureSection />

        {/* Call to Action Section */}
        <CallToActionSection className="min-h-screen flex flex-col justify-center items-center py-12" />

        {/* Footer */}
        <Footer className="py-12" />
      </motion.div>
    </div>
  );
};

export default Landing;
