// Regatta Types
export interface Regatta {
  name: string;
  date: Date;
  uuid: string;
  status: RegattaStatus;
  heats: Heat[];
  location: string;
}

export interface Heat {
  title: string;
  startTime: Date;
  status: HeatStatus;
  finishOrder: FinishedCrew[];
  host: string;
}

export interface FinishedCrew {
  teamName: string;
  totalTime: number;
  lane: number;
  place: number;
  margin: number;
  splitTimes: number[];
  lineup: Athlete[];
  penalty?: Penalty;
}

export interface Athlete {
  name: string;
  seat: LineupSeat;
}

export interface Penalty {
  time: number;
  reason: string;
}

// Enums
export enum HeatStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  UNOFFICIAL = "UNOFFICIAL",
  OFFICIAL = "OFFICIAL",
  BREAK = "BREAK",
}

export enum RegattaStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export enum LineupSeat {
  COX = "C",
  STROKE = "S",
  SEVEN = "7",
  SIX = "6",
  FIVE = "5",
  FOUR = "4",
  THREE = "3",
  TWO = "2",
  BOW = "B",
}
