"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";

const baseBtnStyle =
  "bg-slate-100 hover:bg-slate-200 text-black px-6 py-2 rounded-md capitalize font-bold mt-1 flex items-center mb-2";

const LoginBtn: React.FC = () => {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <Button
      className={baseBtnStyle}
      onClick={() => handleLogin()}
      about="Sign in with Google"
    >
      <Image
        src="/google-48.png"
        alt="Google logo"
        width={24}
        height={24}
        className="mr-2"
      />
      Connexion avec Google
    </Button>
  );
};

export default LoginBtn;
