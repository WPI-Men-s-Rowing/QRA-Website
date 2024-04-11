/**
 * Type to "unwrap" an array, returning the item inside the array
 */
export type Unwrapped<T> = T extends (infer K)[] ? K : never;

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
