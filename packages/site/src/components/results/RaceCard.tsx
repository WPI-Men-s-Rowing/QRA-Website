import {RegattaStatus} from "@/types/types.ts";
import Link from "next/link";

/**
 * Interface representing the props for the RaceCard component
 */
interface RaceCardProps {
    /**
     * The UUID of the regatta, for navigation purposes
     */
    uuid: string;
    /**
     * The name of the regatta, to display
     */
    name: string;
    /**
     * The status of the regatta, to display
     */
    status: RegattaStatus;

    /**
     * The start time of the regatta, to display
     */
    startTime: Date;
}

/**
 * Creates a race card component, which displays brief information about the race, from a regatta
 * @param props the regatta to create the component from
 */
function RaceCard(props: RaceCardProps) {
    return (
        <Link href={"/regattas/results/" + props.uuid}>
            <div className="w-auto h-auto p2.5 border-black border-2 rounded-xl p-2">
                <div className="lg:text-2xl whitespace-nowrap text-xl">{props.name}</div>
                <div className="flex flex-row gap-4">
                    <div className="lg:text-xl">
                        {props.startTime.toLocaleDateString([], {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                    <div className="lg:text-xl">{props.status}</div>
                </div>
            </div>
        </Link>
    );
}

export default RaceCard;
