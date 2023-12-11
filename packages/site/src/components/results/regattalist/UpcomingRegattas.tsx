import {Regatta} from "@/types/types.ts";
import RaceCard from "@/components/results/RaceCard.tsx";
import Header from "@/components/text/Header.tsx";

interface UpcomingRegattaProps {
    Regattas: Regatta[];
}

function UpcomingRegattas(props: UpcomingRegattaProps) {

    return (
        <>
            <div className="w-auto flex flex-col gap-5 p-2">
                <Header>
                    Upcoming Regattas
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

export default UpcomingRegattas;
