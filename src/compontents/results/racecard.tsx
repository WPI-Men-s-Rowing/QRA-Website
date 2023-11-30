import {Link} from "react-router-dom";
import {Regatta} from "../../types/types";

interface RaceCardProps {
    regatta: Regatta;
}

function RaceCard(props: RaceCardProps) {
    console.log(props.regatta)
    return (
        <>
            <Link to={"/results/" + props.regatta.uuid}>
                <div className="h-auto w-auto border-b-text-color border-black border-2 rounded-xl p-2">
                    <div className="text-2xl">{props.regatta.name}</div>
                    <div className="flex flex-row gap-4">
                        <div className="text-xl">{props.regatta.status}</div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default RaceCard