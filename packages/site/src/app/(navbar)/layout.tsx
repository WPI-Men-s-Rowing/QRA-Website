import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quinsigamond Rowing Association",
  description: "The official website of the Quinsigamond Rowing Association",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <div className="absolute top-0">
          <NavBar />
        </div>

        <div className="bg-background">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
