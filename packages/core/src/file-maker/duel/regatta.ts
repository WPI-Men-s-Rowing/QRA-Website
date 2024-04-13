import { RegattaService } from "@qra-website/core/dynamo-db";
import { CreateEntityItem } from "electrodb";
import { LakeScheduleEntry } from "../types/duel-types.ts";

/**
 * Determines if a lake schedule lanes entry represents a duel regatta
 * @param lakeScheduleEntry the lake schedule lanes entry to process
 * @returns true if the provided entry is a duel regatta, false otherwise
 */
export function isDuelRegatta(lakeScheduleEntry: LakeScheduleEntry) {
  // Validate the clubtype is correct and the regatta type is correct
  return (
    (lakeScheduleEntry.clubtype === "Col" ||
      lakeScheduleEntry.clubtype === "HS") &&
    lakeScheduleEntry.regattatype === "Sprint"
  );
}

/**
 * Creates the insert args for a regatta given the FileMaker DB entry. Assumes the regatta took place in GMT-4 (EST). This
 * may be problematic in cases where a regatta occurred during the winter daylight savings...
 * @param lakeScheduleEntry the FileMakerDB entry to use in creating the duel regatta
 * @returns the insert args for the duel regatta. Does not actually insert the regatta
 * @throws {Error} if the club type is not Col or HS or the regatta type is not sprint
 */
export function createDuelRegatta(
  lakeScheduleEntry: LakeScheduleEntry,
): CreateEntityItem<typeof RegattaService.entities.regatta> & {
  regattaId: string;
} {
  // Validate host type to be valid for duels
  if (
    lakeScheduleEntry.clubtype !== "Col" &&
    lakeScheduleEntry.clubtype !== "HS"
  ) {
    throw new Error(
      "Cannot create a duel regatta when regatta type is not college or high school",
    );
  }

  // Validate it's a sprint race
  if (lakeScheduleEntry.regattatype !== "Sprint") {
    throw new Error(
      "Cannot create a duel regatta when regatta type is not sprint",
    );
  }

  return {
    regattaId: lakeScheduleEntry.id.toString(),
    name:
      lakeScheduleEntry.racename === ""
        ? `${lakeScheduleEntry.localschool} Duel`
        : lakeScheduleEntry.racename,
    distance: 2000,
    type: "duel",
    host: lakeScheduleEntry.localschool,
    rampClosed: false,
    participantDescription: lakeScheduleEntry.competitors,
    startDate: Date.parse(
      `${lakeScheduleEntry.racedate} ${lakeScheduleEntry.timeStart} GMT-0400`,
    ),
    endDate: Date.parse(
      `${lakeScheduleEntry.racedateEnd} ${lakeScheduleEntry.timeEnd} GMT-0400`,
    ),
  };
}
