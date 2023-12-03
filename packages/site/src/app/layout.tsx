import communityIcon from "@public/icons/navigation/community-icon.svg";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import regattasIcon from "@public/icons/navigation/regattas-icon.svg";
import qraLogo from "@public/qra-logo.png";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

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
                    <Image src={qraLogo} alt="QRA Logo" className="lg:w-[72px] lg:h-[54.17px] w-[42px] h-[30px]"/>
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
                            <Image
                                src={regattasIcon as StaticImageData}
                                alt="Regatta Icon"
                                className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px]"
                            />
                            Regattas
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
        </body>
        </html>
    );
}
