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
   * The start time of the regatta, to display
   */
  startTime: Date;

  /** The end time of the regatta, to display */
  endTime: Date;
  /**
   * The type of the regatta, to display
   */
  type: "duel" | "head" | "championship";
}

/**
 * Creates a race card component, which displays brief information about the race, from a regatta
 * @param props the regatta to create the component from
 */
function RaceCard(props: RaceCardProps) {
  return (
    <Link href={"/regattas/results/" + props.uuid}>
      <div className="w-[379px] h-[100px] p-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-[5px] inline-flex">
        <div className="text-zinc-800 text-opacity-50 text-[10px] font-normal capitalize">
          {props.type}
        </div>
        <div className="self-stretch text-text-color text-2xl font-bold">
          {props.name}
        </div>
        <div className="text-zinc-800 text-base font-normal">
          {props.startTime.toLocaleDateString()}-
          {props.endTime.toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default RaceCard;
