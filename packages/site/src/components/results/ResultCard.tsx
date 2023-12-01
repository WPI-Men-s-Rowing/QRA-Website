"use client";

import { FinishedCrew, HeatStatus } from "@/types/types.ts";
import grow from "@public/icons/expand.svg";
import shrink from "@public/icons/shrink.svg";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import ResultLine from "./ResultLine";

/**
 * Interface representing the props in a result card
 */
interface ResultCardProps {
  /**
   * The title of the regatta
   */
  title: string;
  /**
   * The regatta's start time
   */
  startTime: Date;
  /**
   * The host of the regatta
   */
  host: string;
  /**
   * The status of the regatta
   */
  status: HeatStatus;
  /**
   * Finishing crews in the regatta
   */
  finishOrder: FinishedCrew[];
}

/**
 * Component that crates a result card showing the results of an individual race
 * @param props the properties defining the result card
 */
function ResultCard(props: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (expanded)
    return (
      <div className="transition-all duration-700 w-full h-[500px] px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="self-stretch h-[51px] flex-col justify-start items-start gap-[5px] flex">
          <div className="text-red-900 text-2xl font-bold">{props.title}</div>

          <div className="self-stretch justify-between items-start inline-flex">
            <div>
              <span className="text-zinc-800 text-[10px] font-normal ">
                Scheduled:{" "}
              </span>
              <span className="text-zinc-800 text-[10px] font-bold ">
                {props.startTime.getHours()}:{props.startTime.getMinutes()}
              </span>
              <span className="text-zinc-800 text-[10px] font-bold ">
                {props.startTime.getHours() > 12 ? "PM" : "AM"}
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
              <span className="text-zinc-800 text-[10px] font-normal ">
                Status:{" "}
              </span>
              <span className="text-zinc-800 text-[10px] font-bold ">
                {props.status}
              </span>
            </div>
          </div>
          <div className="self-stretch h-[0px] border border-zinc-800 border-opacity-20"></div>
        </div>
        <div className="self-stretch grow shrink basis-0 bg-neutral-50 rounded-[10px] shadow flex-col justify-start items-start flex overflow-x-hidden">
          <div className="self-stretch p-2.5 bg-neutral-700 justify-between items-start inline-flex">
            <div className="w-11 text-neutral-50 text-base font-bold text-center">
              Place
            </div>
            <div className="w-[39px] text-neutral-50 text-base font-bold text-center">
              Lane
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              Entry
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              500m
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              1000m
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              1500m
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              Finish
            </div>
            <div className="w-[57px] text-neutral-50 text-base font-bold text-center">
              Margin
            </div>
          </div>
          <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex p-1">
            {props.finishOrder
              .filter((result) => result.place != 0)
              .sort((a, b) => a.place - b.place)
              .map((result, index) => (
                <ResultLine {...result} key={index} expanded={true} />
              ))}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="text-zinc-800 text-[10px] font-normal ">
            *Penalty - tap penalized time for details
          </div>
          <Image
            width={20}
            height={20}
            src={shrink as StaticImageData}
            className="cursor-pointer"
            alt="Shrink Icon"
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      </div>
    );
  else
    return (
      <div className="transition-all duration-700 w-[405px] h-[413px] px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="self-stretch h-[51px] flex-col justify-start items-start gap-[5px] flex">
          <div className="text-red-900 text-2xl font-bold">{props.title}</div>

          <div className="self-stretch justify-between items-start inline-flex">
            <div>
              <span className="text-zinc-800 text-[10px] font-normal ">
                Scheduled:{" "}
              </span>
              <span className="text-zinc-800 text-[10px] font-bold ">
                {props.startTime.getHours()}:{props.startTime.getMinutes()}
              </span>
              <span className="text-zinc-800 text-[10px] font-bold ">
                {props.startTime.getHours() > 12 ? "PM" : "AM"}
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
              <span className="text-zinc-800 text-[10px] font-normal ">
                Status:{" "}
              </span>
              <span className="text-zinc-800 text-[10px] font-bold ">
                {props.status}
              </span>
            </div>
          </div>
          <div className="self-stretch h-[0px] border border-zinc-800 border-opacity-20"></div>
        </div>
        <div className="self-stretch grow shrink basis-0 bg-neutral-50 rounded-[10px] shadow flex-col justify-start items-start flex overflow-x-hidden">
          <div className="self-stretch p-2.5 bg-neutral-700 justify-between items-start inline-flex">
            <div className="w-11 text-neutral-50 text-base font-bold text-center">
              Place
            </div>
            <div className="w-[39px] text-neutral-50 text-base font-bold text-center">
              Lane
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              Entry
            </div>
            <div className="w-20 text-neutral-50 text-base font-bold text-center">
              Finish
            </div>
            <div className="w-[57px] text-neutral-50 text-base font-bold text-centers">
              Margin
            </div>
          </div>
          <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex p-1">
            {props.finishOrder
              .filter((result) => result.place != 0)
              .sort((a, b) => a.place - b.place)
              .map((result, index) => (
                <ResultLine {...result} key={index} expanded={false} />
              ))}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="text-zinc-800 text-[10px] font-normal ">
            *Penalty - tap penalized time for details
          </div>
          <Image
            width={20}
            height={20}
            src={grow as StaticImageData}
            className="cursor-pointer"
            alt="Expand Icon"
            onClick={() => setExpanded(true)}
          />
        </div>
      </div>
    );
}

export default ResultCard;
