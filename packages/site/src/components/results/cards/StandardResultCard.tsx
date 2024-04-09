"use client";

import { Heat } from "@/lib/utils/regattas/types.ts";
import ResultLine from "../ResultLine.tsx";

/**
 * Component that crates a result card showing the results of an individual race
 * @param props the properties defining the result card
 */
function StandardResultCard(props: Heat & { host: string }) {
  return (
    <>
      <div className="self-stretch h-[51px] flex-col justify-start items-start gap-[5px] flex">
        <div className="text-red-900 text-2xl font-bold text-red capitalize">
          {props.type.displayName}
        </div>

        <div className="self-stretch justify-between items-start inline-flex">
          <div>
            <span className="text-zinc-800 text-[10px] font-normal ">
              Scheduled:{" "}
            </span>
            <span className="text-zinc-800 text-[10px] font-bold ">
              {props.scheduledStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div>
            <span className="text-zinc-800 text-[10px] font-normal ">
              Host:{" "}
            </span>
            <span className="text-zinc-800 text-[10px] font-bold ">
              {props.host}
            </span>
          </div>
          <div>
            <span className="text-zinc-800 text-[10px] font-normal capitalize">
              Status:{" "}
            </span>
            <span className="text-zinc-800 text-[10px] font-bold capitalize">
              {props.status}
            </span>
          </div>
        </div>
        <div className="self-stretch h-[0px] border border-zinc-800 border-opacity-20"></div>
      </div>
      <div className="self-stretch grow shrink basis-0 bg-neutral-50 rounded-[10px] shadow flex-col justify-start items-start flex overflow-x-hidden">
        <div className="self-stretch p-2.5 bg-neutral-700 justify-between items-start inline-flex">
          <div className="w-11 text-neutral-50 lg:text-base text-sm font-bold text-center">
            Place
          </div>
          <div className="w-[39px] text-neutral-50 lg:text-base text-sm font-bold text-center">
            Lane
          </div>
          <div className="w-20 text-neutral-50 lg:text-base text-sm font-bold text-center">
            Entry
          </div>
          <div className="w-20 text-neutral-50 lg:text-base text-sm font-bold text-center">
            Finish
          </div>
          <div className="w-[57px] text-neutral-50 lg:text-base text-sm font-bold text-centers">
            Margin
          </div>
        </div>
        <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex p-1">
          {props.entries.map((result, index) => (
            <ResultLine
              entry={{
                ...result,
                place: index + 1,
              }}
              key={index}
              expanded={false}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default StandardResultCard;
