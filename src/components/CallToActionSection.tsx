import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Turnstile } from "@marsidev/react-turnstile";

const verbs = ["améliorer", "organiser", "réaliser", "optimiser", "planifier"];

export default function CallToActionSection({ className = "" }) {
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const verbRef = useRef<HTMLDivElement>(null);
  const longestVerb = verbs.reduce((a, b) => (a.length > b.length ? a : b));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerbIndex((prevIndex) => (prevIndex + 1) % verbs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (verbRef.current) {
      verbRef.current.style.width = `${longestVerb.length}ch`;
    }
  }, [longestVerb.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast({
        title: "Erreur",
        description: "Veuillez compléter le captcha.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description:
            "Votre pré-inscription a été enregistrée. Vérifiez votre boîte mail.",
        });
        setEmail("");
      } else {
        throw new Error("Erreur lors de la pré-inscription");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} id="newsletter">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-white">
          Prêt à{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentVerbIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              ref={verbRef}
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
                width: `${longestVerb.length}ch`,
              }}
            >
              {verbs[currentVerbIndex]}
            </motion.span>
          </AnimatePresence>{" "}
          votre Secret Santa ?
        </h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <input
            type="email"
            placeholder="Entrez votre email professionnel"
            className="p-2 mb-4 md:mb-6 w-full text-white bg-white bg-opacity-10 border-none rounded-lg backdrop-blur-md placeholder:text-white focus:border-none focus:ring-0 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* hCaptcha Component */}
          <Turnstile
            options={{ size: "invisible", theme: "light" }}
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!}
            onSuccess={(token) => {
              setCaptchaToken(token);
            }}
            className="mb-4"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto bg-white text-orange-600 hover:bg-gray-200"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Commencer Gratuitement"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
