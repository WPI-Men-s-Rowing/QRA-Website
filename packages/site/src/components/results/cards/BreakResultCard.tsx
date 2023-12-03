import {FinishedCrew, HeatStatus} from "@/types/types.ts";

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
function BreakResultCard(props: ResultCardProps) {
    return (
        <>
            <div
                className={`transition-all duration-700 lg:w-[405px] w-full h-[413px] px-[15px] pt-2.5 pb-[15px] bg-neutral-50 rounded-[20px] border border-zinc-800 border-opacity-20 flex-col justify-start items-start gap-2.5 inline-flex`}
            >
                <div className="self-stretch h-full flex-col justify-center items-center gap-[5px] flex">
                    <div className="text-zinc-800 text-3xl font-bold">{props.title}</div>
                    <div className="text-zinc-800 font-bold">
                        {props.startTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BreakResultCard;
