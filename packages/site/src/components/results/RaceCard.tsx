import { Regatta } from "@/lib/utils/regattas/types";
import Link from "next/link";

/**
 * Creates a race card component, which displays brief information about the race, from a regatta
 * @param props the regatta to create the component from
 */
function RaceCard(props: Regatta) {
  return (
    <Link href={"/regattas/results/" + props.regattaId}>
      <div className="w-[379px] h-[100px] p-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-[5px] inline-flex">
        <div className="text-zinc-800 text-opacity-50 text-[10px] font-normal capitalize">
          {props.type}
        </div>
        <div className="self-stretch text-text-color text-2xl font-bold">
          {props.name}
        </div>
        <div className="text-zinc-800 text-base font-normal">
          {props.startDate.toLocaleDateString()}-
          {props.endDate.toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default RaceCard;
