import { RegattaStatus } from "@/types/types.ts";
import Link from "next/link";

/**
 * Interface representing the props for the RaceCard component
 */
interface RaceCardProps {
  /**
   * The UUID of the regatta, for navigation purposes
   */
  uuid: string;
  /**
   * The name of the regatta, to display
   */
  name: string;
  /**
   * The status of the regatta, to display
   */
  status: RegattaStatus;

  /**
   * The start time of the regatta, to display
   */
  startTime: Date;
}

/**
 * Creates a race card component, which displays brief information about the race, from a regatta
 * @param props the regatta to create the component from
 */
function RaceCard(props: RaceCardProps) {
  return (
    <Link href={"/regattas/results/" + props.uuid}>
      <div className="w-[379px] h-[100px] p-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-[5px] inline-flex">
        <div className="text-zinc-800 text-opacity-50 text-[10px] font-normal">
          Head Race
        </div>
        {/*##TODO: Change to match regatta type*/}
        <div className="self-stretch text-red text-2xl font-bold">
          {props.name}
        </div>
        <div className="text-zinc-800 text-base font-normal">
          {props.startTime.toLocaleDateString()}-
          {props.startTime.toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default RaceCard;
