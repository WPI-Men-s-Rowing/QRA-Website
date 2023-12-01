import {Regatta} from "@/types/types.ts";
import Link from "next/link";

interface RaceCardProps {
    regatta: Regatta;
}

function RaceCard(props: RaceCardProps) {
    return (
        <>
            <Link href={"/regattas/results/" + props.regatta.uuid}>
                <div className="h-auto w-auto border-b-text-color border-black border-2 rounded-xl p-2">
                    <div className="text-2xl">{props.regatta.name}</div>
                    <div className="flex flex-row gap-4">
                        <div className="text-xl">{props.regatta.status}</div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default RaceCard;
