import {Link} from "react-router-dom";

interface RaceCardProps {
    Name: string;
    Date: string;
    Status: string;
    UUID: string;
}

function RaceCard(props: RaceCardProps) {

    return (
        <>
            <Link to={"/results/" + props.UUID}>
                <div className="h-auto w-auto border-b-text-color border-black border-2 rounded p-2">
                    <div className="text-2xl">{props.Name}</div>
                    <div className="flex flex-row gap-4">
                        <div className="text-xl">{props.Date}</div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default RaceCard
