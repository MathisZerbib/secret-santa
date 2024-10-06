// pages/success.tsx

import { useRouter } from "next/router";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (!session_id) {
      router.push("/dashboard");
    }
  }, [session_id, router]);

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-white">
          Paiement Réussi !
        </h1>
        <p className="text-lg mb-8 text-white">
          Merci pour votre achat. Votre paiement a été effectué avec succès.
        </p>
        <button
          onClick={handleRedirect}
          className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition"
        >
          Aller au Tableau de Bord
        </button>
      </div>
    </div>
  );
}
