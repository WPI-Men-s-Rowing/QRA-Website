import { RegattaService } from "@qra-website/core/dynamo-db";
import { CreateEntityItem } from "electrodb";
import { LakeScheduleLanesEntry } from "../types/duel-types.ts";

/**
 * Determines if a lanes entry is a valid break
 * @param lakeScheduleLanesEntry the entry to parse to determine if it is a break
 * @returns true if the entry is a break; false otherwise
 */
export function isDuelBreak(lakeScheduleLanesEntry: LakeScheduleLanesEntry) {
  return (
    lakeScheduleLanesEntry.event === "Break" ||
    lakeScheduleLanesEntry.host === "Break"
  );
}

/**
 * Creates a break from the FileMakerDB lake schedule lanes entry. Assumes the break took place/will take place in GMT-4
 * @param regattaId the ID of the regatta to attach this break to
 * @param lakeScheduleLanesEntry the lanes entry to create the break from
 * @returns the create args for the break
 * @throws {Error} if isBreak returns false (meaning the break is not a valid break)
 */
export function createDuelRegattaBreak(
  regattaId: string,
  lakeScheduleLanesEntry: LakeScheduleLanesEntry,
): CreateEntityItem<typeof RegattaService.entities.break> {
  // Validate that this is indeed a break
  if (!isDuelBreak(lakeScheduleLanesEntry)) {
    throw new Error(
      "Cannot create a break out of an entry that is not a break!",
    );
  }

  // Parse the date, as we'll use it in two places
  const date = new Date(`${lakeScheduleLanesEntry.racedatetime} GMT-0400`);

  // Create the break. If it's in the past, it's in the past. Otherwise, it's complete
  return {
    breakId: lakeScheduleLanesEntry.id.toString(),
    regattaId: regattaId,
    scheduledStart: date.getTime(),
    status: date < new Date() ? "complete" : "scheduled",
  };
}
