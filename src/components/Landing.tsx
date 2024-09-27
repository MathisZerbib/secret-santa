"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { FaGift, FaUserFriends, FaLock } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Home: React.FC = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const features = [
    {
      icon: FaGift,
      title: "Tirage au Sort Automatique",
      description: "Un algorithme intelligent pour un tirage équitable.",
    },
    {
      icon: FaUserFriends,
      title: "Échanges Anonymes",
      description:
        "Communiquez de manière anonyme avec votre Père Noël Secret.",
    },
    {
      icon: FaLock,
      title: "Sécurité & Confidentialité",
      description:
        "Vos données sont protégées avec un chiffrement de bout en bout.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="#hero" className="text-2xl font-bold">
            Cadeau Secret Pro
          </a>
          <div className="space-x-6">
            <a href="#features" className="hover:text-gray-300 transition">
              Fonctionnalités
            </a>
            <a href="#cta" className="hover:text-gray-300 transition">
              Commencer
            </a>
          </div>
        </div>
      </motion.nav>
      {/* Hero Section */}
      <motion.section
        ref={targetRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <Image
            src="/gift.png"
            alt="Hero background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </motion.div>
        <div className="relative z-10 text-center">
          <motion.h1
            className="text-7xl font-extrabold mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secret Pro
          </motion.h1>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Simplifiez l&apos;organisation de vos événements Cadeau Secret avec
            notre plateforme innovante.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => (window.location.href = "#features")}
            >
              Découvrir
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      {features.map((feature, index) => (
        <motion.section
          id="features"
          key={index}
          className="min-h-screen flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <feature.icon className="text-8xl mb-4 text-white" />
            </motion.div>
            <motion.div
              className="md:w-1/2 text-left"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-4">{feature.title}</h2>
              <p className="text-xl text-gray-300">{feature.description}</p>
            </motion.div>
          </div>
        </motion.section>
      ))}

      {/* CTA Section */}
      <motion.section
        id="cta"
        className="min-h-screen flex items-center justify-center bg-zinc-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <motion.h2
            className="text-5xl font-bold mb-8"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Prêt à rendre votre Cadeau Secret mémorable ?
          </motion.h2>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Input
              placeholder="Entrez votre email professionnel"
              className="mb-4 w-80 text-black"
            />
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Commencer Gratuitement
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      {/* <footer className="bg-black py-8 text-center text-gray-400">
        <p>
          © 2024 Cadeau Secret Pro. Tous droits réservés. | Politique de
          confidentialité | Conditions d&apos;utilisation
        </p>
      </footer> */}

      <Footer />
    </div>
  );
};

export default Home;
