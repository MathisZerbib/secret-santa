// components/LogoutButton.tsx
"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    "use server";
    await signOut({ redirect: false });
    router.push("/app");
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      Logout
    </button>
  );
};

export default LogoutButton;
