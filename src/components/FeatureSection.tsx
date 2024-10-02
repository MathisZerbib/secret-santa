import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift, FaUserFriends, FaLock, FaSnowflake } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Feature data
const features = [
  {
    id: 0,
    icon: FaGift,
    title: "Tirage Intelligent",
    subtitle: "Algorithme IA",
    description:
      "Grâce à l'intelligence artificielle, notre système de tirage au sort est conçu pour garantir une expérience juste et personnalisée, répondant aux besoins de chaque participant.",
    badge: "IA",
    detailedDescription:
      "L'algorithme IA analyse vos préférences et personnalise les tirages de cadeaux pour garantir une répartition équilibrée.",
  },
  {
    id: 1,
    icon: FaUserFriends,
    title: "Échanges Anonymes",
    subtitle: "Communication sécurisée",
    description:
      "Vos échanges restent privés grâce à notre système d'anonymisation. Partagez des indices mystérieux sans jamais révéler votre identité avant l'heure du déballage.",
    badge: "Privé",
    detailedDescription:
      "Communiquez en toute sécurité et anonymat grâce à notre messagerie cryptée, garantissant des échanges mystérieux et amusants.",
  },
  {
    id: 2,
    icon: FaLock,
    title: "Sécurité Renforcée",
    subtitle: "Protection des données",
    description:
      "Vos données personnelles sont protégées par un cryptage de bout en bout, assurant une confidentialité totale tout au long de l'événement.",
    badge: "Crypté",
    detailedDescription:
      "Avec un cryptage de bout en bout, vos informations restent sécurisées à tout moment, garantissant une confidentialité maximale.",
  },
  {
    id: 3,
    icon: FaSnowflake,
    title: "Expérience Unique",
    subtitle: "Personnalisation avancée",
    description:
      "Créez des événements sur mesure avec des options de personnalisation avancées. Rendez votre Secret Santa inoubliable avec une interface flexible et intuitive.",
    badge: "Custom",
    detailedDescription:
      "Une personnalisation complète pour adapter l'expérience à vos besoins, en ajoutant des thèmes, des restrictions de cadeau, et plus.",
  },
];

const FeatureSection = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Start with the first feature highlighted
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToNextFeature = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
    setProgress(0); // Reset progress when switching features
  }, []);

  useEffect(() => {
    const cycleTime = isHovered ? 8000 : 4000; // Change cycle time based on hover
    const progressInterval = 100; // Progress updates every 100ms

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        // If progress is full, move to next feature
        if (prevProgress >= 100) {
          goToNextFeature();
          return 0; // Reset progress after switching features
        }
        // Increment progress smoothly
        return Math.min(
          prevProgress + (progressInterval / cycleTime) * 100,
          100
        );
      });
    }, progressInterval);

    return () => {
      clearInterval(intervalRef.current!); // Cleanup on unmount
    };
  }, [goToNextFeature, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setProgress(0); // Reset progress when not hovered
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0); // Reset progress when clicking a feature
  };

  return (
    <section id="features" className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black opacity-80 backdrop-blur-lg z-0"></div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-center text-white pb-8 sm:pb-8 md:pb-12 lg:pb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Fonctionnalités Clés
        </motion.h2>
        {/* // subtitle only on mobile  */}

        <motion.p
          className="text-center text-lg text-gray-300 mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Découvrez comment Secret Santa Pro rend votre événement unique
        </motion.p>

        {/* Features Grid - Full on larger screens, only active on mobile */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
              className={`${activeIndex === index ? "" : "hidden"} lg:block`} // Show only the active card on mobile
            >
              <Card
                className={`h-full bg-white bg-opacity-10 border-gray-700 hover:bg-opacity-20 transition-all duration-300 overflow-hidden group backdrop-blur-md ${
                  activeIndex === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center text-center">
                  <div className="absolute top-0 right-0 m-2">
                    <Badge
                      variant="secondary"
                      className="bg-white text-black text-xs font-semibold"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <feature.icon className="text-4xl mb-3 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg md:text-xl font-semibold mb-1 group-hover:text-gray-300 transition-colors duration-300 text-white">
                    {feature.title}
                  </h3>
                  <p className="hidden md:block text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Description Section */}
        <AnimatePresence mode="wait" key={activeIndex}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="mt-8 md:mt-12 max-w-3xl mx-auto bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-md shadow-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              {features[activeIndex].title}
            </h3>
            <p className="text-lg text-gray-300 mb-6 text-center">
              {features[activeIndex].detailedDescription}
            </p>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={goToNextFeature}
                className="text-white border-white hover:bg-white hover:text-black transition-colors duration-300"
              >
                Suivant
              </Button>
              <Progress
                value={progress}
                className="w-1/2 md:w-1/3"
                style={{
                  height: "0.3rem",
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeatureSection;
