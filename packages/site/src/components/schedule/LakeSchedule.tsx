import ScheduleCard from "@/components/schedule/ScheduleCard.tsx";

interface LakeScheduleProps {
  regattas: {
    name: string;
    host: string;
    startDate: EpochTimeStamp;
    endDate: EpochTimeStamp;
    participantDescription: string;
    type: string;
    rampClosed: boolean;
  }[];
}

function LakeSchedule({ regattas }: LakeScheduleProps) {
  return (
    <div className="flex lg:flex-row flex-col overflow-auto">
      {regattas
        .sort((a, b) => a.startDate - b.endDate)
        .reduce((uniqueDates: string[], schedule) => {
          const dateString = new Date(schedule.startDate).toLocaleDateString();
          if (!uniqueDates.includes(dateString)) {
            uniqueDates.push(dateString);
          }
          return uniqueDates;
        }, [])
        .map((dateString, index) => (
          <div className="flex" key={index}>
            <div key={index} className="flex flex-col gap-2.5">
              <div className="text-text text-2xl font-normal">{dateString}</div>
              {regattas
                .filter(
                  (schedule) =>
                    new Date(schedule.startDate).toLocaleDateString() ===
                    dateString,
                )
                .map((schedule, index) => (
                  <ScheduleCard key={index} {...schedule} />
                ))}
            </div>
            <div className="w-px bg-divider border-0 h-full mx-4" />
          </div>
        ))}
    </div>
  );
}

export default LakeSchedule;
