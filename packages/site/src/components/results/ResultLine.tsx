import Image from "next/image";

/**
 * Props for the ResultLine component
 */
interface ResultLineProps {
  teamName: string;
  splitTimes: number[];
  totalTime: number;
  margin: number | null;
  expanded: boolean;
  place: number;
  lane: number;
}

/**
 * Component representing a singular line in a results viewer, e.g., represents one crew
 * @param props props determining the crew and how to render the line
 */
function ResultLine(props: ResultLineProps) {
  if (props.expanded)
    return (
      <>
        <div
          className={`self-stretch p-2.5 justify-between items-start inline-flex ${
            props.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`
          }`}
        >
          <div className="w-11 text-zinc-800 text-base font-bold ">
            {props.place}
          </div>
          <div className="w-[39px] text-zinc-800 text-base font-bold ">
            {props.lane}
          </div>
          <div className="flex flex-col justify-start items-center gap-0 text-center">
            <div className="w-20 text-zinc-800 text-base font-bold">
              {props.teamName}
            </div>
            <Image
              width={28}
              height={28}
              src={`https://www.regattatiming.com/images/org/${props.teamName.toLowerCase()}.svg`}
              alt={`${props.teamName} Logo`}
              className="rounded-full"
            />
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {props.splitTimes[0]}
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {props.splitTimes[1]}
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {props.splitTimes[2]}
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {props.totalTime}
          </div>
          <div className="w-[57px] text-zinc-800 text-base font-bold text-center">
            {props.margin}
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
          <div className="flex flex-col justify-start items-center gap-0 text-center">
            <div className="w-20 text-zinc-800 text-base font-bold text-center">
              {props.teamName}
            </div>
            <Image
              width={28}
              height={28}
              src={`https://www.regattatiming.com/images/org/${props.teamName.toLowerCase()}.svg`}
              alt="Logo"
              className="rounded-full"
            />
          </div>
          <div className="w-20 text-zinc-800 text-base font-bold text-center">
            {props.totalTime}
          </div>
          <div className="w-[57px] text-zinc-800 text-base font-bold text-center">
            {props.margin}
          </div>
        </div>
      </>
    );
}

export default ResultLine;
