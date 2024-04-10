import RaceCard from "@/components/results/RaceCard.tsx";
import Header from "@/components/text/Header.tsx";
import { getRegattasSummary } from "@/lib/utils/regattas/get-regattas-summary.ts";

async function getThisWeeksRegattas() {
  const now = new Date();
  const races = await getRegattasSummary(now);
  return races.slice(0, 4);
}

async function UpcomingRegattas() {
  const data = await getThisWeeksRegattas();

  return (
    <>
      <div className="w-auto flex flex-col gap-5 p-2">
        <Header>Upcoming Regattas</Header>
        {data.map((regatta) => {
          return (
            <RaceCard
              uuid={regatta.regattaId}
              name={regatta.name}
              key={regatta.regattaId}
              startTime={regatta.startDate}
              endTime={regatta.endDate}
              type={regatta.type}
            />
          );
        })}
      </div>
    </>
  );
}

export default UpcomingRegattas;
