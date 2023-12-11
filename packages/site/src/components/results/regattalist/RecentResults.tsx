import {Regatta} from "@/types/types.ts";
import RaceCard from "@/components/results/RaceCard.tsx";
import Header from "@/components/text/Header";

interface RecentResultsProps {
    Regattas: Regatta[];
}

function RecentResults(props: RecentResultsProps) {

    return (
        <>
            <div className="w-auto flex flex-col gap-5 p-2">
                <Header>
                    Recent Results
                </Header>
                {props.Regattas.map((regatta) => {
                    return (
                        <RaceCard
                            uuid={regatta.uuid}
                            name={regatta.name}
                            status={regatta.status}
                            key={regatta.uuid}
                            startTime={regatta.date}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default RecentResults;
