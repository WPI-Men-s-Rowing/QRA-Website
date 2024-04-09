import RaceCard from "@/components/results/RaceCard.tsx";
import Header from "@/components/text/Header";
import { Regatta } from "@/lib/utils/regattas/types";

function RecentResults(props: { regattas: Regatta[] }) {
  return (
    <>
      <div className="w-auto flex flex-col gap-5 p-2">
        <Header>Recent Results</Header>
        {props.regattas.map((regatta) => {
          return <RaceCard {...regatta} key={regatta.regattaId} />;
        })}
      </div>
    </>
  );
}

export default RecentResults;
