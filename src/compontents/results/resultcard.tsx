import ResultLine from "./resultLine.tsx";

interface ResultCardProps {
    EventName: string;
    EventTime: string;
    EventStatus: string;
}

function ResultCard(props: ResultCardProps) {
    return (
        <>
            <div
                className="w-[405px] h-[413px] px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch h-[51px] flex-col justify-start items-start gap-[5px] flex">
                    <div className="text-red-900 text-2xl font-bold">{props.EventName}</div>
                    <div className="self-stretch justify-between items-start inline-flex">
                        <div><span
                            className="text-zinc-800 text-[10px] font-normal ">Scheduled: </span><span
                            className="text-zinc-800 text-[10px] font-bold ">{props.EventTime}</span></div>
                        <div><span className="text-zinc-800 text-[10px] font-normal ">Status: </span><span
                            className="text-zinc-800 text-[10px] font-bold ">{props.EventStatus}</span></div>
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
                        <ResultLine TeamName={"WPI"} FinishTime={"99:99.99"} Margin={"99:99.99"} Place={0}
                                    Lane={1}/>
                        <ResultLine TeamName={"Williams"} FinishTime={"99:99.99"} Margin={"99:99.99"} Place={1}
                                    Lane={3}/>
                        <ResultLine TeamName={"Yale"} FinishTime={"99:99.99"} Margin={"99:99.99"} Place={2}
                                    Lane={4}/>
                        <ResultLine TeamName={"Tufts"} FinishTime={"99:99.99"} Margin={"99:99.99"} Place={3}
                                    Lane={2}/>
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
