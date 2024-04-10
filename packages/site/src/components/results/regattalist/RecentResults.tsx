import RaceCard from "@/components/results/RaceCard.tsx";
import Header from "@/components/text/Header";
import { getRegattasSummary } from "@/lib/utils/regattas/get-regattas-summary.ts";

async function getThisWeeksRegattas() {
  const now = new Date();
  const startOfDay = new Date(now.setDate(now.getDate() - 7)); // 7 days back
  const endOfDay = new Date(); // Current day
  const races = await getRegattasSummary(
    startOfDay,
    undefined,
    undefined,
    endOfDay,
  );
  return races.slice(0, 4);
}

async function RecentResults() {
  const data = await getThisWeeksRegattas();
  return (
    <>
      <div className="w-auto flex flex-col gap-5 p-2">
        <Header>Recent Results</Header>
        {data.map((regatta) => {
          return <RaceCard {...regatta} key={regatta.regattaId} />;
        })}
      </div>
    </>
  );
}

export default RecentResults;
