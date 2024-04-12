import { RegattaService } from "@qra-website/core/dynamo-db";
import { CreateEntityItem } from "electrodb";
import {
  LakeScheduleEntry,
  LakeScheduleLanesEntry,
} from "../types/duel-types.ts";
import { createDuelRegattaBreak, isDuelBreak } from "./break.ts";
import { createDuelRegattaHeat } from "./heat.ts";
import { HeatWithLanesEntry, processProgression } from "./progression.ts";
import { createDuelRegatta } from "./regatta.ts";

/**
 * Creates an individual duel regatta from its lake schedule entry and lake schedule lanes entry
 * @param regattaEntry the regatta entry from the lake schedule
 * @param lanesEntries the individual lanes entries for the provided regatta
 * @returns the create arguments for each of the regatta, heats, and breaks
 * @throws {Error} if anything is malformed/incorrect for a duel, or the regatta ID does not match any of the lanes entries IDs
 */
export default function createDuel(
  regattaEntry: LakeScheduleEntry,
  lanesEntries: LakeScheduleLanesEntry[],
): {
  regatta: CreateEntityItem<typeof RegattaService.entities.regatta>;
  heats: CreateEntityItem<typeof RegattaService.entities.heat>[];
  breaks: CreateEntityItem<typeof RegattaService.entities.break>[];
} {
  // Create the regatta and heats
  const regatta = createDuelRegatta(regattaEntry);
  const entries: HeatWithLanesEntry[] = [];
  const breaks: ReturnType<typeof createDuelRegattaBreak>[] = [];

  // Process each heat
  lanesEntries.forEach((lanesEntry) => {
    // Validate that we got the correct lake schedule ID from the lanes entry
    if (lanesEntry.lk_schd_id !== regattaEntry.id) {
      throw new Error(
        "Encountered a lanes entry that does not belong to the provided regatta!",
      );
    }

    // If it is a break, then save it as such. Otherwise, save it as a heat
    if (isDuelBreak(lanesEntry)) {
      breaks.push(createDuelRegattaBreak(regatta.regattaId, lanesEntry));
    } else {
      entries.push({
        lanesEntry,
        heat: createDuelRegattaHeat(regatta.regattaId, lanesEntry),
      });
    }
  });

  // Process progression on the entries
  processProgression(entries);

  // Return the create args
  return {
    regatta,
    heats: entries.map((entry) => entry.heat),
    breaks,
  };
}
