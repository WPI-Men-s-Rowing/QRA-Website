"use client";
import communityIcon from "@public/icons/navigation/community-icon.svg";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import regattasIcon from "@public/icons/navigation/regattas-icon.svg";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DropdownItem {
  label: string;
  path: string;
}

interface DropdownProps {
  title: string;
  items: DropdownItem[];
}

function Dropdown({ title, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [icon, setIcon] = useState<StaticImageData>(
    homeIcon as StaticImageData,
  );
  const router = useRouter();

  const handleItemClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  useEffect(() => {
    switch (title) {
      case "Home":
        setIcon(homeIcon as StaticImageData);
        break;
      case "Regattas":
        setIcon(regattasIcon as StaticImageData);
        break;
      case "Community":
        setIcon(communityIcon as StaticImageData);
        break;
      default:
        setIcon(homeIcon as StaticImageData);
        break;
    }
  }, [title]);

  return (
    <div className={`relative pointer-events-auto`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`flex flex-row text-white items-center gap-2 text-opacity-50`}
      >
        <Link
          href={`/${title.toLowerCase()}`}
          className="flex flex-row text-white items-center gap-2 text-opacity-50"
        >
          <Image
            src={icon}
            alt={title + " Icon"}
            className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px]"
          />
          {title}
        </Link>
      </button>
      {isOpen && (
        <div
          className="fixed left-0 bg-red rounded w-full p-2 text-white cursor-auto gap-2.5"
          onMouseOver={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(false)}
        >
          <div className="lg:text-2xl text-xl font-bold">{title}</div>
          <hr className="h-px bg-background-subtext border-0 my-[5px]" />
          {/* eslint-disable-next-line react/prop-types */}
          {items.map((item) => (
            <div
              key={item.path}
              className="cursor-pointer pb-2.5 hover:text-gray-400 w-fit"
              onClick={() => handleItemClick(item.path)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
