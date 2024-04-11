import { LakeScheduleLanesEntry } from "../types/duel-types";
import { createDuelRegattaHeat } from "./heat";

/**
 * Processes progression information on the provided heats, adding it to each of the heats created when applicable
 * @param heatsMap the map of heats to create progression information in. This will be mutated as a result of this operation.
 * Map of ID to original information and processed information
 * @throws {Error} if the algorithm cannot properly determine progression information
 */
export function processProgression(
  heatsMap: Map<
    number,
    {
      lanesEntry: LakeScheduleLanesEntry;
      heat: ReturnType<typeof createDuelRegattaHeat>;
    }
  >,
) {
  // Array of the final heats
  const heatsArray = [...heatsMap.values()];
  heatsArray.forEach((heat) => {
    // If the heat progression is already defined, something else has handled this so we can skip
    if (heat.heat.progression !== undefined) {
      return;
    }

    // Heats with the same type
    const entriesWithSameType = heatsArray.filter(
      (innerHeat) =>
        innerHeat.heat.type.displayName === heat.heat.type.displayName,
    );
    if (entriesWithSameType.length === 1) {
      return;
    } // Do nothing if we got only one of the same type

    // Validate that we have exactly one heat that could be the final
    const finalEligibleHeats = entriesWithSameType.filter(
      (heatWithSameType) =>
        /(?:heat|h)\s+([1-9])/gim.exec(heatWithSameType.lanesEntry.event) ===
          undefined &&
        !heatWithSameType.lanesEntry.host.toLowerCase().includes("heat"),
    );

    const heatNumberToHeat = new Map<
      number,
      {
        lanesEntry: LakeScheduleLanesEntry;
        heat: ReturnType<typeof createDuelRegattaHeat>;
      }
    >(); // Map relating the heat number to its heat

    // Heat display number
    let heatNumber = 0;

    // For each of the heats that are potentially the final
    entriesWithSameType
      .sort((a, b) => a.lanesEntry.id - b.lanesEntry.id)
      .forEach((entryWithSameType) => {
        // Check to make sure we're not looking at the final
        if (
          finalEligibleHeats.some(
            (finalHeat) =>
              finalHeat.heat.heatId === entryWithSameType.heat.heatId,
          )
        ) {
          return;
        }

        // Determine the heat number this is
        const heatRegex = /(?:heat|h)\s+([1-9])/gim.exec(
          entryWithSameType.lanesEntry.event,
        );
        if (heatRegex === null) {
          heatNumber++; // If it's not explicitly specified, increment to get the heat number
        } else {
          heatNumber = parseInt(heatRegex.groups![0]); // Parse the heat number if we explicitly have it
        }

        // Save the heat this is
        heatNumberToHeat.set(heatNumber, entryWithSameType);
      });
  });
}
