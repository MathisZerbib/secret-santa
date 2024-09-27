import React from "react";
import { motion } from "framer-motion";
import { FaGift, FaUserFriends, FaLock, FaSnowflake } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: FaGift,
    title: "Tirage Intelligent",
    description: "Algorithme équitable et personnalisé",
    badge: "IA",
  },
  {
    icon: FaUserFriends,
    title: "Échanges Anonymes",
    description: "Communication sécurisée et mystérieuse",
    badge: "Privé",
  },
  {
    icon: FaLock,
    title: "Sécurité Renforcée",
    description: "Protection des données de bout en bout",
    badge: "Crypté",
  },
  {
    icon: FaSnowflake,
    title: "Expérience Unique",
    description: "Personnalisation avancée des événements",
    badge: "Custom",
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Fonctionnalités Clés
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 m-4">
                    <Badge
                      variant="secondary"
                      className="bg-white text-black text-xs font-semibold"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <feature.icon className="text-6xl mb-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
