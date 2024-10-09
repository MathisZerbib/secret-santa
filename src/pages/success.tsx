// pages/success.tsx

import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-4 sm:w-1/2 sm:mx-auto md:w-1/2 md:mx-auto lg:w-1/2 lg:mx-auto">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Inscription Réussie !
        </h1>
        <p className="text-lg mb-8 text-white">
          Nous vous avons envoyé un email avec les détails de votre inscription
          ainsi que les informations de connexion.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition"
        >
          Aller au Tableau de Bord
        </button>
      </div>
    </div>
  );
}
