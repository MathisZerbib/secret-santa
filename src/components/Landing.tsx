"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import FeatureSection from "./FeatureSection";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";

const Landing: React.FC = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* ShaderGradient Background */}
      <div className="fixed inset-0 z-0">
        <ShaderGradientCanvas style={{ width: "100%", height: "100%" }}>
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=2&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=env&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.4&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 py-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Secret Pro
            </Link>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="hover:text-gray-300 transition">
                Fonctionnalités
              </a>
              <a href="#cta" className="hover:text-gray-300 transition">
                Commencer
              </a>
              <Link href="/app" className="hover:text-gray-300 transition">
                App
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          ref={targetRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
            {/* Background image or other components */}
          </motion.div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              className="text-6xl md:text-7xl font-extrabold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Secret Santa Réinventé
            </motion.h1>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
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
                size="lg"
                className="bg-white text-black hover:bg-gray-200"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Découvrir les Fonctionnalités
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <FeatureSection />

        {/* CTA Section */}
        <motion.section
          id="cta"
          className="py-20 bg-zinc-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Prêt à révolutionner votre Secret Santa ?
            </motion.h2>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <Input
                placeholder="Entrez votre email professionnel"
                className="mb-4 w-full text-black"
              />
              <Button
                size="lg"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Commencer Gratuitement
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
