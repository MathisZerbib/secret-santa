import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import Footer from "@/components/Footer";

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
  title: "Secret Santa Company",
  description: "Organize secret santa events for your company",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-50 text-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-cover bg-center bg-no-repeat`}
        id="root-body"
      >
        <div className="min-h-screen flex flex-col items-center justify-center w-full">
          {children}
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
