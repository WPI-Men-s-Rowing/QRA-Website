import communityIcon from "@public/icons/navigation/community-icon.svg";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import regattasIcon from "@public/icons/navigation/regattas-icon.svg";
import qraLogo from "@public/qra-logo.png";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QRA",
  description: "The official website of the Quinsigamond Rowing Association",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="w-full top-0 z-10 p-2 absolute bg-gradient-to-b from-black to-transparent">
          <div className="mx-auto">
            <div className="flex items-center justify-between h-16">
              <Image width={72} height={54.17} src={qraLogo} alt="QRA Logo" />
              <div className="flex flex-row gap-10 text-gray-900">
                <Link
                  href={"/"}
                  className="flex flex-row text-white items-center gap-2 text-opacity-50"
                >
                  <Image
                    width={40}
                    height={40}
                    src={homeIcon as StaticImageData}
                    alt="Home Icon"
                  />
                  Home
                </Link>
                <Link
                  href={"/regattas"}
                  className="flex flex-row text-white items-center gap-2 text-opacity-50"
                >
                  <Image
                    width={40}
                    height={40}
                    src={regattasIcon as StaticImageData}
                    alt="Regatta Icon"
                  />
                  Regattas
                </Link>
                <Link
                  href={"/community"}
                  className="flex flex-row text-white items-center gap-2 text-opacity-50"
                >
                  <Image
                    width={40}
                    height={40}
                    src={communityIcon as StaticImageData}
                    alt="Home Icon"
                  />
                  Community
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
