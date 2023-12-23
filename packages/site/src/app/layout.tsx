import Dropdown from "@/app/dropdown.tsx";
import communityIcon from "@public/icons/navigation/community-icon.svg";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import qraLogo from "@public/qra-logo.png";
import sportsGraphicsLogo from "@public/sports-graphics-logo.png";
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
        <nav className="w-full top-0 z-10 p-2 absolute bg-gradient-to-b from-black to-transparents">
          <div className="mx-auto">
            <div className="flex items-center justify-between h-16">
              <Image
                src={qraLogo}
                alt="QRA Logo"
                className="lg:w-[72px] lg:h-[54.17px] w-[42px] h-[30px]"
              />
              <div className="flex flex-row lg:gap-10 gap-4 text-gray-900">
                <Link
                  href={"/"}
                  className="flex flex-row text-white items-center gap-2 text-opacity-50"
                >
                  <Image
                    src={homeIcon as StaticImageData}
                    alt="Home Icon"
                    className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px]"
                  />
                  Home
                </Link>
                <Link
                  href={"/regattas"}
                  className="flex flex-row text-white items-center gap-2 text-opacity-50"
                >
                  <Dropdown
                    title="Regattas"
                    items={[
                      { label: "Dropdown Item", path: "/regattas/" },
                      { label: "Dropdown Item", path: "/regattas/" },
                      { label: "Dropdown Item", path: "/regattas/" },
                      { label: "Dropdown Item", path: "/regattas/" },
                      { label: "Dropdown Item", path: "/regattas/" },
                    ]}
                  />
                </Link>
                <Link
                  href={"/community"}
                  className="flex flex-row text-white items-center gap-2 text-opacity-50"
                >
                  <Image
                    src={communityIcon as StaticImageData}
                    alt="Home Icon"
                    className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px]"
                  />
                  Community
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer>
          <div className="w-full h-[88.68px] p-2.5 bg-neutral-700 justify-between items-center inline-flex">
            <div className="flex-col justify-start items-start gap-[5px] inline-flex">
              <div className="text-neutral-50 text-[10px] font-normal">
                ©️ {new Date().getFullYear()} Quinsigamond Rowing Association,
                Inc.
              </div>
              <div className="justify-start items-start gap-[5px] inline-flex">
                <div className="text-neutral-50 text-[10px] font-normal">
                  Photos courtesy of
                </div>
                <div className="text-blue-500 text-[10px] font-normal underline">
                  SportGraphics.com
                </div>
              </div>
              <div className="self-stretch text-neutral-50 text-[10px] font-normal">
                Website developed by Bob Nyce, Ian Wright, and Emerson Shatouhy
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-2.5 inline-flex">
              <Image
                className="w-[39px] h-[29.34px]"
                src={qraLogo}
                alt={"QRA Logo"}
              />
              <Image
                className="w-[37.41px] h-[29.34px]"
                src={sportsGraphicsLogo}
                alt={"Sports Graphics Logo"}
              />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
