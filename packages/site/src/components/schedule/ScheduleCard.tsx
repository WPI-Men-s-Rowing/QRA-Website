"use client";
import qraLogo from "@public/qra-logo.png";
import DOMPurify from "dompurify";
import Image from "next/image";
import useSWR from "swr";

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
  startDate: EpochTimeStamp;

  /**
   * The end time of the regatta, to display
   */
  endDate: EpochTimeStamp;

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
  const { data } = useSWR<string>(
    // This defers to the local route which gets image data
    `/teams/${props.host}/icon`,
    async (url: string) =>
      // Now we sanitize the image data (just to be safe)
      DOMPurify.sanitize(
        // Then we fetch it as simple text
        (await (await fetch(url)).text()).replace(
          // This looks really complicated but is super simple - it replaces the first instance of width and height with 28px each,
          // so the SVGs fit as expected
          /width="\d+(px)?" height="\d+(px)?"/m,
          `width="28px" height="28px"`,
        ),
      ),
  );
  return (
    <div className="w-[379px] h-fit p-4 bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 flex">
      <div className="self-stretch h-[41.02px] flex-col justify-start items-start gap-1 inline-flex">
        <div className="self-stretch justify-between items-start inline-flex">
          <div className="justify-center items-center gap-[5px] flex">
            {data?.toString().includes("svg") ? ( // Set to QRA logo if the schools logo doesn't exist
              <div
                dangerouslySetInnerHTML={{
                  __html: data ?? "",
                }}
              />
            ) : (
              <Image
                src={qraLogo}
                alt="QRA Logo"
                className="w-[42px] h-[30px]"
              />
            )}

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
              ? `${new Date(props.startDate).toLocaleTimeString(
                  [],
                  timeOptions,
                )} - ${new Date(props.endDate).toLocaleTimeString(
                  [],
                  timeOptions,
                )}`
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
