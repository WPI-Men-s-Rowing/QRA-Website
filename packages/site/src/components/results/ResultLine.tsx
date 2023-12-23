"use client";

import LineupPopOver from "@/components/results/popover/LineupPopOver.tsx";
import { Athlete } from "@/types/types.ts";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Props for the ResultLine component
 */
interface ResultLineProps {
  teamName: string;
  splitTimes: number[];
  totalTime: number;
  margin: number;
  expanded: boolean;
  place: number;
  lane: number;
  lineup: Athlete[];
}

/**
 * Component representing a singular line in a results viewer, e.g., represents one crew
 * @param props props determining the crew and how to render the line
 */
function ResultLine(props: ResultLineProps) {
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==",
  );

  // This ensures that image loading is deferred as long as possible
  useEffect(() => {
    setImageUrl(
      `https://www.regattatiming.com/images/org/${props.teamName.toLowerCase()}.svg`,
    );
  }, [props.teamName]);

  const msToTime = (duration: number) => {
    const milliseconds = parseInt(String((duration % 1000) / 100));
    let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 && hours > 0 ? hours : hours;
    minutes = minutes < 10 && minutes > 0 ? minutes : minutes;
    seconds = seconds < 10 && seconds > 0 ? seconds : seconds;

    return hours > 0
      ? hours + ":" + minutes + ":" + seconds + "." + milliseconds
      : minutes + ":" + seconds + "." + milliseconds;
  };

  if (props.expanded)
    return (
      <>
        <div
          className={`w-full self-stretch p-2.5 justify-between items-start inline-flex ${
            props.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`
          }`}
        >
          <div className="w-11 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.place}
          </div>
          <div className="w-[39px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.lane}
          </div>
          <span
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className={"cursor-pointer"}
          >
            <div className="flex flex-col justify-start items-center gap-0 text-center">
              <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold">
                {props.teamName}
              </div>
              <div className="w-[28px] h-[28px] relative">
                <Image
                  fill
                  sizes="28,28"
                  src={imageUrl}
                  alt="Logo"
                  className="cursor-pointer"
                />
              </div>
              <LineupPopOver
                lineup={props.lineup}
                isVisible={isPopoverVisible}
              />
            </div>
          </span>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.splitTimes[0])}
          </div>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.splitTimes[1])}
          </div>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.splitTimes[2])}
          </div>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.totalTime)}
          </div>
          <div className="w-[57px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.margin)}
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <div
          className={`self-stretch p-2.5 justify-between items-start inline-flex ${
            props.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`
          }`}
        >
          <div className="w-11 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.place}
          </div>
          <div className="w-[39px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.lane}
          </div>
          <span
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className={"cursor-pointer"}
          >
            <div className="flex flex-col justify-start items-center gap-0 text-center">
              <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
                {props.teamName}
              </div>
              <div className="w-[28px] h-[28px] relative">
                <Image
                  fill
                  sizes="28,28"
                  src={imageUrl}
                  alt="Logo"
                  className="cursor-pointer"
                />
              </div>
              <LineupPopOver
                lineup={props.lineup}
                isVisible={isPopoverVisible}
              />
            </div>
          </span>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.totalTime)}
          </div>
          <div className="w-[57px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {msToTime(props.margin)}
          </div>
        </div>
      </>
    );
}

export default ResultLine;
