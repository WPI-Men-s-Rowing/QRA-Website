import ResultCard from "@/components/results/ResultCard";

import {
  FinishedCrew,
  Heat,
  HeatStatus,
  Regatta,
  RegattaStatus,
} from "@/types/types";

function ResultsDetails() {
  const WPI: FinishedCrew = {
    teamName: "WPI",
    totalTime: 99999,
    lane: 1,
    place: 0,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Tufts: FinishedCrew = {
    teamName: "Tufts",
    totalTime: 99999,
    lane: 2,
    place: 1,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Bates: FinishedCrew = {
    teamName: "Bates",
    totalTime: 99999,
    lane: 3,
    place: 2,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const MIT: FinishedCrew = {
    teamName: "MIT",
    totalTime: 99999,
    lane: 4,
    place: 3,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Harvard: FinishedCrew = {
    teamName: "Harvard",
    totalTime: 99999,
    lane: 5,
    place: 4,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Brown: FinishedCrew = {
    teamName: "Brown",
    totalTime: 99999,
    lane: 6,
    place: 5,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Northeastern: FinishedCrew = {
    teamName: "Northeastern",
    totalTime: 99999,
    lane: 7,
    place: 6,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Dartmouth: FinishedCrew = {
    teamName: "Dartmouth",
    totalTime: 99999,
    lane: 8,
    place: 7,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Yale: FinishedCrew = {
    teamName: "Yale",
    totalTime: 99999,
    lane: 9,
    place: 8,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Princeton: FinishedCrew = {
    teamName: "Princeton",
    totalTime: 99999,
    lane: 10,
    place: 9,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Columbia: FinishedCrew = {
    teamName: "Columbia",
    totalTime: 99999,
    lane: 11,
    place: 10,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Penn: FinishedCrew = {
    teamName: "Penn",
    totalTime: 99999,
    lane: 12,
    place: 11,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };
  const Cornell: FinishedCrew = {
    teamName: "Cornell",
    totalTime: 99999,
    lane: 13,
    place: 12,
    margin: 0,
    splitTimes: [99999, 99999, 99999],
  };

  const heat1: Heat = {
    title: "Men's Varsity 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(Date.parse("2023-11-29 14:00:00")),
    host: "WPI",
    finishOrder: [
      WPI,
      Tufts,
      Bates,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  };
  const heat2: Heat = {
    title: "Men's 2nd Varsity 8+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Tufts",
    finishOrder: [
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
      WPI,
      Tufts,
      Bates,
    ],
  };
  const heat3: Heat = {
    title: "Women's Varsity 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "Bates",
    finishOrder: [
      Tufts,
      Bates,
      WPI,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  };
  const heat4: Heat = {
    title: "BREAK",
    status: HeatStatus.UPCOMING,
    startTime: new Date(),
    host: "WPI",
    finishOrder: [],
  };
  const heat5: Heat = {
    title: "Men's Novice 4+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "Tufts",
    finishOrder: [
      Bates,
      Tufts,
      WPI,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  };
  const heat6: Heat = {
    title: "Women's Lightweight 4+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Bates",
    finishOrder: [
      WPI,
      Bates,
      Tufts,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  };
  const heat7: Heat = {
    title: "Women's Lightweight 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "MIT",
    finishOrder: [
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
    ],
  };
  const heat8: Heat = {
    title: "Men's Lightweight 8+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Harvard",
    finishOrder: [
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
      MIT,
    ],
  };
  const heat9: Heat = {
    title: "BREAK",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Brown",
    finishOrder: [],
  };
  const heat10: Heat = {
    title: "Men's Freshman 8+",
    status: HeatStatus.ACTIVE,
    startTime: new Date(),
    host: "Northeastern",
    finishOrder: [
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
      MIT,
      Harvard,
      Brown,
      Northeastern,
      Dartmouth,
    ],
  };
  const heat11: Heat = {
    title: "Women's 2nd Varsity 8+",
    status: HeatStatus.OFFICIAL,
    startTime: new Date(),
    host: "Dartmouth",
    finishOrder: [
      Dartmouth,
      Yale,
      Princeton,
      Columbia,
      Penn,
      Cornell,
      MIT,
      Harvard,
      Brown,
      Northeastern,
    ],
  };

  const testRegatta: Regatta = {
    name: "Quinsigamond Snake Regatta",
    date: new Date(),
    uuid: "1234",
    location: "Lake Quinsigamond",
    status: RegattaStatus.UPCOMING,
    heats: [
      heat1,
      heat2,
      heat3,
      heat4,
      heat5,
      heat6,
      heat7,
      heat8,
      heat9,
      heat10,
      heat11,
    ],
  };
  return (
    <>
      {/*<Navbar/>*/}
      <div className="text-4xl text-left text-red underline underline-offset-8 decoration-text-color decoration-1">
        {testRegatta.name} Results
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row justify-start gap-4 flex-wrap p-2">
          {testRegatta.heats.map((heat) => {
            return <ResultCard data={heat} key={heat.startTime.getTime()} />;
          })}
        </div>
      </div>
    </>
  );
}

export default ResultsDetails;
