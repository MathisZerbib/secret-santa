import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";

// Import local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Family Christmas Gift List",
  description: "A simple app to manage your family Christmas gift list.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-50 text-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-cover bg-center bg-no-repeat`}
        id="root-body"
      >
        <div className="min-h-screen flex flex-col items-center justify-center">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
