import {useEffect} from "react";

interface ResultCardProps {
    TeamName: string;
    FinishTime: string;
    Margin: string;
    Place: number;
    Lane: number;
}

function ResultLine(props: ResultCardProps) {
    useEffect(() => {
        console.log(props.Place % 2 == 0);
    }, []);
    return (
        <>
            <div
                className={`self-stretch p-2.5 justify-between items-start inline-flex ${props.Place % 2 == 0 ? `bg-neutral-50` : `bg-gray-200`}`}>
                <div className="w-11 text-zinc-800 text-base font-bold ">{props.Place}</div>
                <div className="w-[39px] text-zinc-800 text-base font-bold ">{props.Lane}</div>
                <div className="flex flex-col justify-start items-start gap-0">
                    <div className="w-20 text-zinc-800 text-base font-bold ">{props.TeamName}</div>
                    <img src={`https://www.regattatiming.com/images/org/${props.TeamName.toLowerCase()}.svg`} alt="Logo"
                         className="w-7 h-7 rounded-full"/>
                </div>
                <div className="w-20 text-zinc-800 text-base font-bold ">{props.FinishTime}</div>
                <div className="w-[57px] text-zinc-800 text-base font-bold ">{props.Margin}</div>
            </div>
        </>
    )
}

export default ResultLine
