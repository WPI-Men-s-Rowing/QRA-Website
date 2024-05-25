import { LakeScheduleLanesEntry } from "../types/duel-types.ts";
import { Unwrapped } from "../types/utils.ts";
import { createDuelHeat } from "./heat.ts";

// Type that concatenates a lanes entry with its heat
export interface HeatWithLanesEntry {
  lanesEntry: LakeScheduleLanesEntry;
  heat: ReturnType<typeof createDuelHeat>;
}

// Type of an entry within an event
type Entry = Unwrapped<HeatWithLanesEntry["heat"]["entries"]>;

/**
 * Builds a map that relates heat number (e.g., heat 1 NOT ID) to the heat and lake entry the heat belongs to.
 * Also adds Heat ${number} to the heat's progression description
 * @param entries the entries that are heats for this regatta
 * @returns a map relating heat number to the heat and lake entry the heat belongs to
 */
function buildHeatMap(
  entries: HeatWithLanesEntry[],
): Map<number, HeatWithLanesEntry> {
  const heatNumberToHeat = new Map<
    number,
    {
      lanesEntry: LakeScheduleLanesEntry;
      heat: ReturnType<typeof createDuelHeat>;
    }
  >(); // Map relating the heat number to its heat

  // Heat display number
  let heatNumber = 0;

  // For each of the heats that are potentially the final
  entries
    .toSorted((a, b) => a.lanesEntry.id - b.lanesEntry.id)
    .forEach((entryWithSameType) => {
      // Determine the heat number this is
      const heatRegex = /(?:heat|h)\s+([1-9])/gim.exec(
        entryWithSameType.lanesEntry.event,
      );
      if (heatRegex === null) {
        heatNumber++; // If it's not explicitly specified, increment to get the heat number
      } else {
        heatNumber = parseInt(heatRegex[1]); // Parse the heat number if we explicitly have it
      }

      // Assign the heat number to the progression information
      entryWithSameType.heat.progression = {
        description: `Heat ${heatNumber}`,
      };

      // Save the heat this is
      heatNumberToHeat.set(heatNumber, entryWithSameType);
    });

  return heatNumberToHeat;
}

/**
 * Builds the progression for a given entry in a given final based on the entry with a full-formed team name
 * this algorithm has limits - for example, it fails to find cases where progression is based on fastest from multiple heats
 * @param heats the heats to search for the full-formed team name in
 * @param final the final to assign progression to
 * @param finalEntry the entry in the final to build progression for
 * @throws {Error} if no matching entry could be found or the entry that progressed did not have a finish time
 */
function buildProgressionByResults(
  heats: HeatWithLanesEntry[],
  final: HeatWithLanesEntry,
  finalEntry: Entry,
) {
  // Whether we have found a match
  let matchFound = false;
  heats.forEach((heat) => {
    // If we have match, don't keep looping
    if (matchFound) {
      return;
    }

    // For each entry in the heat
    heat.heat.entries.forEach((heatEntry) => {
      // If we already have a match, just return
      if (matchFound) {
        return;
      }

      // Check to make sure we got the right team
      if (
        heatEntry.teamName === finalEntry.teamName &&
        heatEntry.teamEntryLetter === finalEntry.teamEntryLetter
      ) {
        // Determine the index of the finish position, so we can assign. Order by finish time, ignore everything that DNF'd
        // There are no penalties in duel races
        const entriesByFinishPosition = heat.heat.entries
          .filter((entry) => entry.finishTime !== undefined)
          .sort((a, b) => a.finishTime! - b.finishTime!);
        let index: number | undefined;
        entriesByFinishPosition.forEach((orderedEntry, orderedIndex) => {
          if (orderedEntry.bowNumber === heatEntry.bowNumber) {
            index = orderedIndex;
          }
        });

        // Ensure that the entry had a finish time
        if (index === undefined) {
          throw new Error(
            `Found an entry (${heatEntry.teamName}) that progressed with no finish time`,
          );
        }

        // Add the progression to the final
        final.heat.progression!.previous!.entries.push({
          sourceIds: [heat.heat.heatId],
          bowNumber: finalEntry.bowNumber,
          startPosition: index + 1,
        });

        // Save that we got a match
        matchFound = true;
      }
    });
  });

  // Validate that we got a match
  if (!matchFound) {
    throw new Error(
      `Failed to find a match for team ${finalEntry.teamName} in any heat`,
    );
  }
}

/**
 * Function that assigns the progression for the heats that may or may not belong to the given final
 * @param heats the map relating heat number (not ID) to the heat
 * @param final the final to add progression information to. Assumes the progression and previous[] already exist
 */
function assignProgressionForFinal(
  heats: Map<number, HeatWithLanesEntry>,
  final: HeatWithLanesEntry,
) {
  // For each of the entries in the heat
  final.heat.entries.forEach((finalEntry) => {
    const entryRegex =
      /([1-9]+)(?:st|nd|rd|th) (?:(?:(?:h|heat)\s?([1-9]+))|(?:fastest))/gim.exec(
        finalEntry.teamName,
      );

    // If we didn't get anything back from the regex, that means
    // we've lost the progression information due to the results being
    // populated. So, go back through and determine progression information
    // based on who came from where
    if (entryRegex === null) {
      buildProgressionByResults([...heats.values()], final, finalEntry);
      return;
    }

    // Create the start position
    let startPosition = parseInt(entryRegex[1]);

    // Build the source heats. Regex group 2 is the heat number, so if we have that, use it. Otherwise, it's all
    const sourceHeats = entryRegex[2]
      ? [heats.get(parseInt(entryRegex[2]))!]
      : [...heats.values()];

    // If this is a singular entry, we need to modify the start position
    // so that we don't include entries we already have in the count
    startPosition -= Math.max(
      final.heat.progression!.previous!.entries.filter((entry) =>
        entry.sourceIds.some((id) => id === sourceHeats[0].heat.heatId),
      ).length,
      0,
    );

    // Otherwise, we build progression based on the entry regex
    final.heat.progression!.previous!.entries.push({
      sourceIds: sourceHeats.map((heat) => heat.heat.heatId),
      bowNumber: finalEntry.bowNumber,
      startPosition: startPosition - 1,
    });

    // Build the final array of entries
    let entries: Entry[] = [];
    sourceHeats.forEach((heat) => {
      entries = entries.concat(heat.heat.entries);
    });

    // Remove entries from the source heats that didn't finish and any entries that are already in the final.
    // Then sort the remaining by finish time
    entries = entries
      .filter(
        (entry) =>
          entry.finishTime !== undefined &&
          !final.heat.entries.some(
            (potentialDuplicateEntry) =>
              potentialDuplicateEntry.teamName === entry.teamName &&
              potentialDuplicateEntry.teamEntryLetter === entry.teamEntryLetter,
          ),
      )
      .sort((a, b) => a.finishTime! - b.finishTime!);

    // Back-compute the team name for the final results
    finalEntry.teamName = entries[startPosition - 1].teamName;
    finalEntry.teamEntryLetter = entries[startPosition - 1].teamEntryLetter;
  });
}

/**
 * Function that determines if the provided event is a grand final
 * @param eventNameLowercase the lowercase event name
 * @param hostNameLowercase the lowercase hostname string
 * @returns true if the provided event is a grand final, false otherwise
 */
function isGrandFinal(
  eventNameLowercase: string,
  hostNameLowercase: string,
): boolean {
  return (
    eventNameLowercase.includes("gf") || hostNameLowercase.includes("grand")
  );
}

/**
 * Function that determines if the provided event is a petite final
 * @param eventNameLowercase the lowercase event name
 * @param hostNameLowercase the lowercase host name
 * @returns true if the provided event is a petite final, false otherwise
 */
function isPetiteFinal(
  eventNameLowercase: string,
  hostNameLowercase: string,
): boolean {
  return (
    eventNameLowercase.includes("pf") || hostNameLowercase.includes("petite")
  );
}

/**
 * Function that determines if the provided event is a heat
 * @param eventNameLowercase the lowercase event name
 * @param hostNameLowercase the lowercase host name
 * @returns true if the event is a heat, false otherwise
 */
function isHeat(
  eventNameLowercase: string,
  hostNameLowercase: string,
): boolean {
  return (
    /(?:heat|h)\s?([1-9])/gim.exec(eventNameLowercase) !== null ||
    hostNameLowercase.includes("heat")
  );
}

/**
 * Calculates the description for the provided final given the original entry
 * @param final the final to calculate the description for
 * @returns the name for the provided final
 */
function calculateNameForFinal(final: LakeScheduleLanesEntry): string {
  const eventNameLowercase = final.event.toLowerCase();
  const hostNameLowercase = final.host.toLowerCase();

  if (isGrandFinal(eventNameLowercase, hostNameLowercase)) {
    return "Grand Final"; // GF in either is grand final
  } else if (isPetiteFinal(eventNameLowercase, hostNameLowercase)) {
    return "Petite Final"; // PF in either is petite final
  } else {
    // Otherwise, throw
    throw new Error(
      `Unable to determine description for final with name ${final.event}/${final.host}`,
    );
  }
}

/**
 * Processes progression information on the provided heats, adding it to each of the heats created when applicable
 * @param heatsMap the entries of heats to create progression information in. This will be mutated as a result of this operation. Should include HEATS
 * AND FINALS (as you shouldn't know that here)
 * @throws {Error} if the algorithm cannot properly determine progression information.
 * This may leave the input array in an inconsistent state with respect to progression
 */
export function processProgression(entries: HeatWithLanesEntry[]): void {
  entries.forEach((heat) => {
    // If the heat progression is already defined, something else has handled this so we can skip
    if (heat.heat.progression !== undefined) {
      return;
    }

    // Heats with the same type
    const entriesWithSameType = entries.filter(
      (innerHeat) =>
        innerHeat.heat.type.displayName === heat.heat.type.displayName,
    );
    if (entriesWithSameType.length === 1) {
      // Check to make sure we aren't looking at a heat/final
      const eventNameLowercase = heat.lanesEntry.event.toLowerCase();
      const hostNameLowercase = heat.lanesEntry.host.toLowerCase();
      if (isHeat(eventNameLowercase, hostNameLowercase)) {
        throw new Error("Found a heat with no matching finals");
      } else if (
        isGrandFinal(eventNameLowercase, hostNameLowercase) ||
        isPetiteFinal(eventNameLowercase, hostNameLowercase)
      ) {
        throw new Error("Found a final with no matching heats");
      }

      return; // If we're not, that's fine there's just no progression
    }

    // Get all the heats that could be the final
    const finalEligibleHeats = entriesWithSameType.filter(
      (heatWithSameType) =>
        !isHeat(
          heatWithSameType.lanesEntry.event.toLowerCase(),
          heatWithSameType.lanesEntry.host.toLowerCase(),
        ),
    );

    // Build the heat map, remove the final eligible heats from it
    const heatMap = buildHeatMap(
      entriesWithSameType.filter(
        (entry) =>
          !finalEligibleHeats.some(
            (final) => final.heat.heatId === entry.heat.heatId,
          ),
      ),
    );

    // If there are no heats, it's a special case
    if (heatMap.size === 0) {
      // If there are two that can be the final, it's a lane race and then a real race. We can handle that
      // (also ensure that at most one has the GF/PF tag)
      if (
        finalEligibleHeats.length === 2 &&
        finalEligibleHeats.every((final) => {
          const eventNameLowercase = final.lanesEntry.event.toLowerCase();
          const hostNameLowercase = final.lanesEntry.host.toLowerCase();

          return (
            !isGrandFinal(eventNameLowercase, hostNameLowercase) &&
            !isPetiteFinal(eventNameLowercase, hostNameLowercase)
          );
        })
      ) {
        // The one with the higher start time is the final, so sort. Go backwards, so the heat is last so pop removes it
        finalEligibleHeats.sort(
          (a, b) => b.heat.scheduledStart - a.heat.scheduledStart,
        );

        // This won't be undefined, but add the newfound heat to the heat array
        heatMap.set(1, finalEligibleHeats.pop()!);

        // Set the heat progression, as it wasn't set with the heatmap
        heatMap.get(1)!.heat.progression = {
          description: "Heat",
          next: [{ id: finalEligibleHeats[0].heat.heatId }],
        };
      } else {
        // Otherwise we have no idea what to do, just throw
        throw new Error(
          `Found ${finalEligibleHeats.length} finals and 0 heats`,
        );
      }
    }

    // Validate that no heats throws
    if (finalEligibleHeats.length === 0) {
      throw new Error(`Found ${heatMap.size} heats and 0 finals`);
    }

    // Now assign progression for each of the finals
    finalEligibleHeats.forEach((final) => {
      // Try calculating the final name
      let finalName: string;
      try {
        finalName = calculateNameForFinal(final.lanesEntry);
      } catch (error) {
        // If we have a lane race
        if (finalEligibleHeats.length == 1 && heatMap.size == 1) {
          finalName = "Final"; // We can just say final
        } else {
          throw error; // Otherwise, throw cuz we need information
        }
      }
      // Assign progression for the final
      final.heat.progression = {
        description: finalName,
        previous: {
          entries: [],
        },
      };
      assignProgressionForFinal(heatMap, final);
    });
  });
}
