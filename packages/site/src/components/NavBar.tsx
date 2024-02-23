import Dropdown from "@/app/dropdown";
import communityIcon from "@public/icons/navigation/community-icon.svg";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import qraLogo from "@public/qra-logo.png";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

/**
 * Component representing the NavBar in the system, doing all top-level navigation. Absolute, anchored to the top of the nearest relative parent
 */
export default function NavBar() {
  return (
    <nav className="w-full z-10 p-2 bg-gradient-to-b from-[#000000] to-transparent">
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
  );
}
