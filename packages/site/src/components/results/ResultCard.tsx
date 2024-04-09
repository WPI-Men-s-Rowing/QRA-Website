"use client";

import ExpandedResultCard from "@/components/results/cards/ExpandedResultCard.tsx";
import StandardResultCard from "@/components/results/cards/StandardResultCard.tsx";
import { Heat } from "@/lib/utils/regattas/types";
import grow from "@public/icons/expand.svg";
import shrink from "@public/icons/shrink.svg";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
/**
 * Component that crates a result card showing the results of an individual race
 * @param props the properties defining the result card
 */
function ResultCard(props: Heat & { host: string }) {
  const [expanded, setExpanded] = useState(false);
  console.log(props.entries);

  return (
    <div
      className={`transition-all duration-700 ${
        expanded ? `w-screen h-[500px]` : `lg:w-[405px] h-[413px]`
      }  px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex`}
    >
      {expanded ? (
        <ExpandedResultCard {...props} />
      ) : (
        <StandardResultCard {...props} />
      )}
      <div className="flex flex-row justify-between w-full">
        <div className="text-zinc-800 text-[10px] font-normal ">
          *Penalty - tap penalized time for details
        </div>
        {expanded ? (
          <Image
            width={20}
            height={20}
            src={shrink as StaticImageData}
            className="cursor-pointer"
            alt="Shrink Icon"
            onClick={() => setExpanded(!expanded)}
          />
        ) : (
          <Image
            width={20}
            height={20}
            src={grow as StaticImageData}
            className="cursor-pointer"
            alt="Expand Icon"
            onClick={() => setExpanded(!expanded)}
          />
        )}
      </div>
    </div>
  );
}

export default ResultCard;
