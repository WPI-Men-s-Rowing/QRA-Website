"use client";
import communityIcon from "@public/icons/navigation/community-icon.svg";
import homeIcon from "@public/icons/navigation/home-icon.svg";
import regattasIcon from "@public/icons/navigation/regattas-icon.svg";
import Image, { StaticImageData } from "next/image";
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
    <div className={`relative`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex flex-row text-white items-center gap-2 text-opacity-50"
      >
        <Image
          src={icon}
          alt={title + " Icon"}
          className="lg:w-[40px] lg:h-[40px] w-[20px] h-[20px]"
        />
        {title}
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-red rounded">
          {/* eslint-disable-next-line react/prop-types */}
          {items.map((item) => (
            <div
              key={item.path}
              className="p-2 cursor-pointer hover:bg-red-500 hover:text-white"
              onClick={() => handleItemClick(item.path)}
              onMouseOver={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
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
