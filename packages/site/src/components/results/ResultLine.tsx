"use client";

import TeamIcon from "@/components/TeamIcon.tsx";
import { useState } from "react";

/**
 * Props for the ResultLine component
 */
interface ResultLineProps {
  /**
   * Entries in the heat
   */
  entry: {
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
    place: number;
  };
  expanded: boolean;
}

/**
 * Component representing a singular line in a results viewer, e.g., represents one crew
 * @param props props determining the crew and how to render the line
 */
function ResultLine(props: ResultLineProps) {
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  const msToTime = (duration: number) => {
    const milliseconds = parseInt(String((duration % 1000) / 100));
    let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 && hours > 0 ? hours : hours;
    minutes = minutes < 10 && minutes > 0 ? minutes : minutes;
    seconds = seconds < 10 && seconds > 0 ? seconds : seconds;

    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return hours > 0
      ? hours + ":" + minutesString + ":" + seconds + "." + milliseconds
      : minutes + ":" + secondsString + "." + milliseconds;
  };

  if (props.expanded)
    return (
      <>
        <div
          className={`w-full self-stretch p-2.5 justify-between items-start inline-flex ${
            props.entry.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`
          }`}
        >
          <div className="w-11 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.place}
          </div>
          <div className="w-[39px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.bowNumber}
          </div>
          <span
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className={"cursor-pointer"}
          >
            <div className="flex flex-col justify-start items-center gap-0 text-center">
              <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold">
                {props.entry.teamName} {props.entry.teamEntryLetter}
              </div>
              <TeamIcon teamName={props.entry.teamName} />
              {/*<LineupPopOver*/}
              {/*    lineup={props.lineup}*/}
              {/*    isVisible={isPopoverVisible}*/}
              {/*/>*/}
            </div>
          </span>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.segments
              ? msToTime(props.entry.segments[0].time)
              : "-"}
          </div>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.segments
              ? msToTime(props.entry.segments[1].time)
              : "-"}
          </div>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.segments
              ? msToTime(props.entry.segments[2].time)
              : "-"}
          </div>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.finishTime ? msToTime(props.entry.finishTime) : "-"}
          </div>
          <div className="w-[57px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.deltaToNext ? msToTime(props.entry.deltaToNext) : "-"}
          </div>
          <div className="w-[57px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.deltaToWinner
              ? msToTime(props.entry.deltaToWinner)
              : "-"}
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <div
          className={`self-stretch p-2.5 justify-between items-start inline-flex ${
            props.entry.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`
          }`}
        >
          <div className="w-11 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.place}
          </div>
          <div className="w-[39px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.bowNumber}
          </div>
          <span
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className={"cursor-pointer"}
          >
            <div className="flex flex-col justify-start items-center gap-0 text-center">
              <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
                {props.entry.teamName} {props.entry.teamEntryLetter}
              </div>
              <TeamIcon teamName={props.entry.teamName} />
              {/*<LineupPopOver*/}
              {/*    lineup={props.lineup}*/}
              {/*    isVisible={isPopoverVisible}*/}
              {/*/>*/}
            </div>
          </span>
          <div className="w-20 text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.finishTime ? msToTime(props.entry.finishTime) : "-"}
          </div>
          <div className="w-[57px] text-zinc-800 lg:text-base text-sm font-bold text-center">
            {props.entry.deltaToWinner
              ? msToTime(props.entry.deltaToWinner)
              : "-"}
          </div>
        </div>
      </>
    );
}

export default ResultLine;
