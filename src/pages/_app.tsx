import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../app/globals.css";
import { ToastProvider } from "@/components/ui/toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </SessionProvider>
  );
}

export default MyApp;
