import LineupPopOver from "@/components/results/popover/LineupPopOver.tsx";
import { Athlete } from "@/types/types.ts";
import Image from "next/image";
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
          className={`self-stretch p-2.5 justify-between items-start inline-flex ${
            props.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`
          }`}
        >
          <div className="w-11 text-zinc-800 text-base font-bold text-center">
            {props.place}
          </div>
          <div className="w-[39px] text-zinc-800 text-base font-bold text-center">
            {props.lane}
          </div>
          <span
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className={"cursor-pointer"}
          >
            <div className="flex flex-col justify-start items-center gap-0 text-center">
              <div className="w-20 text-zinc-800 text-base font-bold">
                {props.teamName}
              </div>
              <Image
                width={28}
                height={28}
                src={`https://www.regattatiming.com/images/org/${props.teamName.toLowerCase()}.svg`}
                alt={`${props.teamName} Logo`}
              />
              <LineupPopOver
                lineup={props.lineup}
                isVisible={isPopoverVisible}
              />
            </div>
          </span>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {msToTime(props.splitTimes[0])}
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {msToTime(props.splitTimes[1])}
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {msToTime(props.splitTimes[2])}
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {msToTime(props.totalTime)}
          </div>
          <div className="w-[57px] text-zinc-800 text-base font-bold text-center">
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
          <div className="w-11 text-zinc-800 text-base font-bold text-center">
            {props.place}
          </div>
          <div className="w-[39px] text-zinc-800 text-base font-bold text-center">
            {props.lane}
          </div>
          <span
            onClick={() => setPopoverVisible(!isPopoverVisible)}
            className={"cursor-pointer"}
          >
            <div className="flex flex-col justify-start items-center gap-0 text-center">
              <div className="w-20 text-zinc-800 text-base font-bold text-center">
                {props.teamName}
              </div>
              <Image
                width={28}
                height={28}
                src={`https://www.regattatiming.com/images/org/${props.teamName.toLowerCase()}.svg`}
                alt="Logo"
                className="cursor-pointer"
              />
              <LineupPopOver
                lineup={props.lineup}
                isVisible={isPopoverVisible}
              />
            </div>
          </span>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {msToTime(props.totalTime)}
          </div>
          <div className="w-[57px] text-zinc-800 text-base font-bold text-center">
            {msToTime(props.margin)}
          </div>
        </div>
      </>
    );
}

export default ResultLine;
