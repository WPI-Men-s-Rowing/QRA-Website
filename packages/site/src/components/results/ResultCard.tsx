"use client";

import BreakResultCard from "@/components/results/cards/BreakResultCard.tsx";
import ExpandedResultCard from "@/components/results/cards/ExpandedResultCard.tsx";
import StandardResultCard from "@/components/results/cards/StandardResultCard.tsx";
import grow from "@public/icons/expand.svg";
import shrink from "@public/icons/shrink.svg";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

/**
 * Interface representing the props in a result card
 */
interface ResultCardProps {
  host: string;
  breakId?: string;
  type: {
    boatClass: "8+" | "4+" | "4-" | "4x" | "3x" | "2x" | "2+" | "2-" | "1x";
    gender: "men" | "women" | "open";
    displayName?: string;
  };
  scheduledStart: Date;
  delay?: number;
  status: "scheduled" | "delayed" | "unofficial" | "official" | "in-progress";
  entries: {
    teamName: string;
    teamEntryLetter?: string;
    bowNumber: number;
    finishTime?: number;
    rawFinishTime?: number;
    finalFinishTime?: number;
    deltaToNext?: number;
    deltaToWinner?: number;
    segments?: {
      distance: number;
      time: number;
    }[];
  }[];
}

/**
 * Component that crates a result card showing the results of an individual race
 * @param props the properties defining the result card
 */
function ResultCard(props: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  console.log(props.entries);
  if (props.breakId) {
    return <BreakResultCard {...props} />;
  }
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
