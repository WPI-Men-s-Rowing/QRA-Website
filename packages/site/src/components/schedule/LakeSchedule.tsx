import ScheduleCard from "@/components/schedule/ScheduleCard.tsx";

function LakeSchedule() {
  const testSchedule = [
    {
      name: "Class of 2003 Cup",
      host: "WPI",
      startTime: new Date(2024, 3, 23, 8, 0, 0),
      endTime: new Date(2024, 3, 23, 8, 30, 0),
      participants: ["Wesleyan", "Hamilton", "Colby"],
      type: "Duel",
    },
    {
      name: "Cup Name and Stuff",
      host: "Clark",
      startTime: new Date(2024, 3, 23, 8, 30, 0),
      endTime: new Date(2024, 3, 23, 8, 40, 0),
      participants: ["Wesleyan", "Hamilton", "Colby"],
      type: "Duel",
    },
    {
      name: "Why is Yale here??",
      host: "Yale",
      startTime: new Date(2024, 3, 23, 8, 40, 0),
      endTime: new Date(2024, 3, 23, 9, 30, 0),
      participants: ["Wesleyan", "Cal", "Colby"],
      type: "Duel",
    },
    {
      name: "New England Rowing Championship",
      host: "WPI",
      startTime: new Date(2024, 4, 23, 8, 40, 0),
      participants: ["Cool Schools Only"],
      type: "Championship",
      otherInfo: "Ramp closed",
    },
    {
      name: "Why is Yale here??",
      host: "Yale",
      startTime: new Date(2024, 3, 24, 8, 40, 0),
      endTime: new Date(2024, 3, 24, 9, 30, 0),
      participants: ["Wesleyan", "Cal", "Colby"],
      type: "Duel",
    },
    {
      name: "Why is Yale here??",
      host: "Yale",
      startTime: new Date(2024, 6, 24, 8, 40, 0),
      endTime: new Date(2024, 3, 24, 9, 30, 0),
      participants: ["Wesleyan", "Cal", "Colby"],
      type: "Duel",
    },
  ];

  return (
    <div className="flex lg:flex-row flex-col overflow-auto">
      {testSchedule
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        )
        .reduce((uniqueDates: string[], schedule) => {
          const dateString = schedule.startTime.toLocaleDateString();
          if (!uniqueDates.includes(dateString)) {
            uniqueDates.push(dateString);
          }
          return uniqueDates;
        }, [])
        .map((dateString, index) => (
          <div className="flex" key={index}>
            <div key={index} className="flex flex-col gap-2.5">
              <div className="text-text text-2xl font-normal">{dateString}</div>
              {testSchedule
                .filter(
                  (schedule) =>
                    schedule.startTime.toLocaleDateString() === dateString,
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
