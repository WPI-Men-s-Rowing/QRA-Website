"use client";

import TeamIcon from "@/components/TeamIcon.tsx";
import LineupPopOver from "@/components/results/popover/LineupPopOver.tsx";
import { Athlete } from "@/types/types.ts";
import { useState } from "react";

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

  // // This beautiful mob is how we handle image loading completely asynchronously. SWR just simplifies the data flow
  // // (e.g., rather than state and an effect)
  // const {data} = useSWR<string>(
  //     // This defers to the local route which gets image data
  //     `/teams/${props.teamName}/icon`,
  //     async (url: string) =>
  //         // Now we sanitize the image data (just to be safe)
  //         DOMPurify.sanitize(
  //             // Then we fetch it as simple text
  //             (await (await fetch(url)).text()).replace(
  //                 // This looks really complicated but is super simple - it replaces the first instance of width and height with 28px each,
  //                 // so the SVGs fit as expected
  //                 /width="\d+(px)?" height="\d+(px)?"/m,
  //                 `width="28px" height="28px"`,
  //             ),
  //         ),
  // );

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
              <TeamIcon teamName={props.teamName} />
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
              <TeamIcon teamName={props.teamName} />
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
