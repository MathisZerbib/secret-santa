"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import Loader from "./ui/loader";
import { Session } from "next-auth";

const baseBtnStyle =
  "bg-slate-100 hover:bg-slate-200 text-black px-6 py-2 rounded-md capitalize font-bold mt-1 flex items-center mb-2";

function LoginBtn() {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const redirectUrl = session?.user?.isActive
        ? "/dashboard"
        : "/subscription";
      router.push(redirectUrl);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <Loader size={60} />;
  }

  if (status === "unauthenticated") {
    const callbackUrl =
      session?.user?.isActive && session?.user?.subscriptionID
        ? "/dashboard"
        : "/subscription";
    return (
      <Button
        className={baseBtnStyle}
        onClick={() => signIn("google", { callbackUrl })}
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
  }

  return null;
}

export default LoginBtn;
