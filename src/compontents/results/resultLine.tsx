import {FinishedCrew} from "../../types/types.ts";

interface ResultCardProps {
    data: FinishedCrew;
    expanded: boolean;
}

function ResultLine(props: ResultCardProps) {
    if (props.expanded) return (
        <>
            <div
                className={`self-stretch p-2.5 justify-between items-start inline-flex ${props.data.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`}`}>
                <div className="w-11 text-zinc-800 text-base font-bold ">{props.data.place}</div>
                <div className="w-[39px] text-zinc-800 text-base font-bold ">{props.data.lane}</div>
                <div className="flex flex-col justify-start items-center gap-0 text-center">
                    <div className="w-20 text-zinc-800 text-base font-bold">{props.data.teamName}</div>
                    <img src={`https://www.regattatiming.com/images/org/${props.data.teamName.toLowerCase()}.svg`}
                         alt="Logo"
                         className="w-7 h-7 rounded-full"/>
                </div>
                <div className="w-20 text-zinc-800 text-base font-bold text-center">{props.data.splitTimes[0]}</div>
                <div className="w-20 text-zinc-800 text-base font-bold text-center">{props.data.splitTimes[1]}</div>
                <div className="w-20 text-zinc-800 text-base font-bold text-center">{props.data.splitTimes[2]}</div>
                <div className="w-20 text-zinc-800 text-base font-bold text-center">{props.data.totalTime}</div>
                <div className="w-[57px] text-zinc-800 text-base font-bold text-center">{props.data.margin}</div>
            </div>
        </>
    )
    else
        return (
            <>
                <div
                    className={`self-stretch p-2.5 justify-between items-start inline-flex ${props.data.place % 2 == 1 ? `bg-neutral-50` : `bg-gray-200`}`}>
                    <div className="w-11 text-zinc-800 text-base font-bold text-center">{props.data.place}</div>
                    <div className="w-[39px] text-zinc-800 text-base font-bold text-center">{props.data.lane}</div>
                    <div className="flex flex-col justify-start items-center gap-0 text-center">
                        <div className="w-20 text-zinc-800 text-base font-bold text-center">{props.data.teamName}</div>
                        <img src={`https://www.regattatiming.com/images/org/${props.data.teamName.toLowerCase()}.svg`}
                             alt="Logo"
                             className="w-7 h-7 rounded-full"/>
                    </div>
                    <div className="w-20 text-zinc-800 text-base font-bold text-center">{props.data.totalTime}</div>
                    <div className="w-[57px] text-zinc-800 text-base font-bold text-center">{props.data.margin}</div>
                </div>
            </>
        )
}

export default ResultLine
