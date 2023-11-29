import ResultLine from "./resultLine.tsx";
import {Heat} from "../../types/types.ts";


interface ResultCardProps {
    data: Heat;
}


function ResultCard(props: ResultCardProps) {
    console.log(props.data)
    return (
        <>
            <div
                className="w-[405px] h-[413px] px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch h-[51px] flex-col justify-start items-start gap-[5px] flex">
                    <div className="text-red-900 text-2xl font-bold">{props.data.title}</div>

                    <div className="self-stretch justify-between items-start inline-flex">
                        <div><span
                            className="text-zinc-800 text-[10px] font-normal ">Scheduled: </span><span
                            className="text-zinc-800 text-[10px] font-bold ">{props.data.startTime.getHours()}:0{props.data.startTime.getMinutes()}</span>
                            <span
                                className="text-zinc-800 text-[10px] font-bold ">{props.data.startTime.getHours() > 12 ? "PM" : "AM"}</span>
                        </div>
                        <div>
                            <span className="text-zinc-800 text-[10px] font-normal ">Host: </span><span
                            className="text-zinc-800 text-[10px] font-bold ">{props.data.host}</span>
                        </div>
                        <div><span className="text-zinc-800 text-[10px] font-normal ">Status: </span><span
                            className="text-zinc-800 text-[10px] font-bold ">{props.data.status}</span></div>
                    </div>
                    <div className="self-stretch h-[0px] border border-zinc-800 border-opacity-20"></div>
                </div>
                <div
                    className="self-stretch grow shrink basis-0 bg-neutral-50 rounded-[10px] shadow flex-col justify-start items-start flex overflow-x-hidden">
                    <div className="self-stretch p-2.5 bg-neutral-700 justify-between items-start inline-flex">
                        <div className="w-11 text-neutral-50 text-base font-bold ">Place</div>
                        <div className="w-[39px] text-neutral-50 text-base font-bold ">Lane</div>
                        <div className="w-20 text-neutral-50 text-base font-bold ">Entry</div>
                        <div className="w-20 text-neutral-50 text-base font-bold ">Time</div>
                        <div className="w-[57px] text-neutral-50 text-base font-bold ">Margin</div>
                    </div>
                    <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start flex p-1">
                        {props.data.finishOrder.filter((result) => result.place != 0).sort((a, b) => a.place - b.place).map((result, index) => (
                            <ResultLine data={result} key={index}/>
                        ))}
                    </div>

                </div>
                <div className="text-zinc-800 text-[10px] font-normal ">*Penalty - tap penalized time for
                    details
                </div>
            </div>
        </>
    )
}

export default ResultCard
