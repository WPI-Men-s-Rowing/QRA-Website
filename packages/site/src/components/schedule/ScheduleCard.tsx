"use client";
import TeamIcon from "@/components/TeamIcon.tsx";

/**
 * Interface representing the props for the RaceCard component
 */
interface RaceCardProps {
  /**
   * The name of the regatta, to display
   */
  name: string;

  /**
   * The host of the regatta, to display
   */
  host: string;
  /**
   * rampClosed
   */
  rampClosed: boolean;

  /**
   * The start time of the regatta, to display
   */
  startDate: Date;

  /**
   * The end time of the regatta, to display
   */
  endDate: Date;

  /**
   * The location of the regatta, to display
   */
  participantDescription: string;

  /**
   * The type of the regatta, to display
   */
  type: string;
}

/**
 * Creates a race card component, which displays brief information about the race, from a regatta
 * @param props the regatta to create the component from
 */
function ScheduleCard(props: RaceCardProps) {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div className="w-[379px] h-fit p-4 bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 flex">
      <div className="self-stretch h-[41.02px] flex-col justify-start items-start gap-1 inline-flex">
        <div className="self-stretch justify-between items-start inline-flex">
          <div className="justify-center items-center gap-[5px] flex">
            <TeamIcon teamName={props.host} />
            <div className="text-zinc-800 text-base font-bold">
              {props.host}
            </div>
          </div>
          <div className="text-red text-base font-bold capitalize ">
            {props.type}
          </div>
        </div>
        <div className="self-stretch justify-between items-start inline-flex">
          <div className="text-zinc-800 text-opacity-50 text-base font-normal">
            {!props.rampClosed
              ? `${props.startDate.toLocaleTimeString(
                  [],
                  timeOptions,
                )} - ${props.endDate.toLocaleTimeString([], timeOptions)}`
              : "All Day"}
          </div>
          <div className="text-zinc-800 text-opacity-50 text-base font-normal">
            {props.rampClosed ? "Corrazini State Boat Ramp Closed" : ""}
          </div>
        </div>
      </div>
      <hr className=" h-px bg-divider border-0 my-[5px] w-full" />
      <div className="self-stretch text-zinc-800 text-2xl font-bold">
        {props.name}
      </div>
      <div className="text-zinc-800 text-opacity-50 text-base font-normal">
        {props.participantDescription}
      </div>
    </div>
  );
}

export default ScheduleCard;
