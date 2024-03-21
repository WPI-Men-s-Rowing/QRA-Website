import Dropdown from "@/app/dropdown";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import qraLogo from "@public/qra-logo.png";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

/**
 * Component representing the NavBar in the system, doing all top-level navigation. Absolute, anchored to the top of the nearest relative parent
 */
export default function NavBar() {
  return (
    <nav className="w-full p-2 bg-gradient-to-b from-[#000000] to-transparent pointer-events-none hover:bg-red hover:from-red hover:fixed">
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
              className="flex flex-row text-white items-center gap-2 text-opacity-50 pointer-events-auto"
            >
              <Image
                src={homeIcon as StaticImageData}
                alt="Home Icon"
                className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px]"
              />
              Home
            </Link>
            <Dropdown
              title="Regattas"
              items={[
                { label: "Overview", path: "/regattas/test" },
                { label: "Live Timing", path: "/regattas/test2" },
                { label: "Historical Results", path: "/regattas/test3" },
                { label: "Regattas", path: "/regattas/test4" },
                { label: "Duel Racing", path: "/regattas/test5" },
                { label: "Lake Schedule", path: "/regattas/test6" },
              ]}
            />
            <Dropdown
              title="Community"
              items={[
                { label: "Local Rowing Programs", path: "/community/test" },
                { label: "Quinsigamond Rowing Club", path: "/community/test2" },
                {
                  label: "Rules of Racing and Traffic Patterns",
                  path: "/community/test3",
                },
                {
                  label: "Regatta Point Information",
                  path: "/community/test4",
                },
                {
                  label: "Donahue Rowing Center Information",
                  path: "/community/test5",
                },
                { label: "Spectator Information", path: "/community/test6" },
              ]}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
