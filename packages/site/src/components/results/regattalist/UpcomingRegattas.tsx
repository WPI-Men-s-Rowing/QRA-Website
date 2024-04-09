import RaceCard from "@/components/results/RaceCard.tsx";
import Header from "@/components/text/Header.tsx";
import { Regatta } from "@/lib/utils/regattas/types";

interface UpcomingRegattaProps {
  Regattas: Regatta[];
}

function UpcomingRegattas(props: UpcomingRegattaProps) {
  return (
    <>
      <div className="w-auto flex flex-col gap-5 p-2">
        <Header>Upcoming Regattas</Header>
        {props.Regattas.map((regatta) => {
          return <RaceCard {...regatta} key={regatta.regattaId} />;
        })}
      </div>
    </>
  );
}

export default UpcomingRegattas;
