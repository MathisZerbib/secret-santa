"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import Loader from "./ui/loader";

const baseBtnStyle =
  "bg-slate-100 hover:bg-slate-200 text-black px-6 py-2 rounded-md capitalize font-bold mt-1 flex items-center mb-2";

export default function LoginBtn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.isActive) {
        return router.push("/subscription");
      }
      return router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <Loader size={60} />;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Button
          className={baseBtnStyle}
          onClick={() => signIn("google", { callbackUrl: "/subscription" })}
          about="Sign in with Google"
        >
          <Image
            //google-48.png is a 48x48px image
            src="/google-48.png"
            alt="Google logo"
            width={24}
            height={24}
            className="mr-2"
          />
          Connexion avec Google
        </Button>
      </>
    );
  }

  return null;
}
