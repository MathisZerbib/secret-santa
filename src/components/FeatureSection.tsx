import React from "react";
import { motion } from "framer-motion";
import { FaGift, FaUserFriends, FaLock, FaSnowflake } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FaGift,
    title: "Tirage Intelligent",
    subtitle: "Algorithme IA",
    description: "Équitable et personnalisé",
    badge: "IA",
  },
  {
    icon: FaUserFriends,
    title: "Échanges Anonymes",
    subtitle: "Communication sécurisée",
    description: "Mystérieuse et privée",
    badge: "Privé",
  },
  {
    icon: FaLock,
    title: "Sécurité Renforcée",
    subtitle: "Protection des données",
    description: "Cryptage de bout en bout",
    badge: "Crypté",
  },
  {
    icon: FaSnowflake,
    title: "Expérience Unique",
    subtitle: "Personnalisation avancée",
    description: "Événements sur mesure",
    badge: "Custom",
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-16 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black opacity-80 backdrop-blur-lg z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-16 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Fonctionnalités Clés
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white bg-opacity-10 border-gray-700 hover:bg-opacity-20 transition-all duration-300 overflow-hidden group backdrop-blur-md">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 m-2">
                    <Badge
                      variant="secondary"
                      className="bg-white text-black text-xs font-semibold"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <feature.icon className="text-4xl mb-4 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-gray-300 transition-colors duration-300 text-white">
                    {feature.title}
                  </h3>
                  <h4 className="text-sm font-medium mb-2 text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                    {feature.subtitle}
                  </h4>
                  <p className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-3xl font-bold mb-6 text-white">
            Prêt à révolutionner votre Secret Santa ?
          </h2>
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Entrez votre email professionnel"
              className="mb-10 w-full text-white bg-white bg-opacity-10 border-gray-700 focus:border-gray-400 focus:ring focus:ring-gray-400 border-opacity-0"
            />
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-200"
            >
              Commencer Gratuitement
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
