import ResultCard from "@/components/results/ResultCard";
import BreakResultCard from "@/components/results/cards/BreakResultCard";

import { getRegattaDetails } from "@/lib/utils/regattas/get-regatta-details.ts";

async function ResultsDetails({ params }: { params: { raceId: string } }) {
  const data = await getRegattaDetails(params.raceId);

  if (!data) return <div>Loading...</div>;

  const orderedEvents = [
    ...data.heat.map((heat) => {
      return {
        scheduledStart: heat.scheduledStart,
        heat,
        break: undefined,
      };
    }),
    ...data.break.map((breakData) => {
      return {
        scheduledStart: breakData.scheduledStart,
        break: breakData,
        heat: undefined,
      };
    }),
  ];
  orderedEvents.sort((a, b) => {
    return a.scheduledStart.getTime() - b.scheduledStart.getTime();
  });

  return (
    <>
      <div className="ps-2">
        <div className="text-4xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
          {data ? data.regatta.name : "Loading..."}
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row lg:justify-start justify-center gap-4 flex-wrap p-2">
            {orderedEvents
              ? orderedEvents.map((eventToPlace, index) => {
                  return eventToPlace.break ? (
                    <BreakResultCard {...eventToPlace.break} />
                  ) : (
                    <ResultCard
                      {...eventToPlace.heat}
                      host={data.regatta.host}
                      key={index}
                    />
                  );
                })
              : "Loading..."}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultsDetails;
