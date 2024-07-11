import { LakeScheduleLanesEntry } from "../types/duel-types.ts";
import { Unwrapped } from "../types/utils.ts";
import { createDuelHeat } from "./heat.ts";

// Type that concatenates a lanes entry with its heat
export interface HeatWithLanesEntry {
  lanesEntry: LakeScheduleLanesEntry;
  heat: ReturnType<typeof createDuelHeat>;
}

// Helper types
type Entry = Unwrapped<HeatWithLanesEntry["heat"]["entries"]>; // Full entry
type EntryBase = Pick<Entry, "teamName" | "teamEntryLetter">; // Base of an entry (only required types)

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
      const heatRegex = /(?:heat|h)\s?([1-9])/gim.exec(
        entryWithSameType.lanesEntry.event,
      );
      if (heatRegex === null) {
        heatNumber++; // If it's not explicitly specified, increment to get the heat number
      } else {
        heatNumber = parseInt(heatRegex[1]); // Parse the heat number if we explicitly have it
      }

      // Ensure this isn't a duplicate heat
      if (heatNumberToHeat.has(heatNumber)) {
        throw new Error(`Found a duplicate heat #${heatNumber}`);
      }

      // Assign the heat number to the progression information
      entryWithSameType.heat.progression = {
        description: `Heat ${heatNumber}`,
        next: [],
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
 * @param progressionEntrySet progression entries, used for duplicate checking. In the form startPosition_heat IDs (comma separated)
 * @param entrySet calculated entries, used for duplicate checking. In the form teamName_teamEntryLetter
 * @throws {Error} if no matching entry could be found or the entry that progressed did not have a finish time
 */
function buildProgressionByResults(
  heats: HeatWithLanesEntry[],
  final: HeatWithLanesEntry,
  finalEntry: Entry,
  progressionEntrySet: Set<string>,
  entrySet: Set<string>,
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
        const entryHash = `${heatEntry.teamName}_${heatEntry.teamEntryLetter}`;

        if (entrySet.has(entryHash)) {
          // Ensure this entry isn't a duplicate
          throw new Error(
            `Encountered a duplicate final entry ${heatEntry.teamName} ${
              heatEntry.teamEntryLetter ?? ""
            }`,
          );
        }

        entrySet.add(entryHash);

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

        const calculatedStartPosition =
          index -
          final.heat.progression!.previous!.entries.filter(
            (entry) =>
              entry.startPosition! < index! &&
              entry.sourceIds.every((id) => id === heat.heat.heatId),
          ).length;

        // Only save this entry. No need to check here, because we have results, so we know this check will work
        progressionEntrySet.add(
          `${calculatedStartPosition}_${heat.heat.heatId}`,
        );

        // Add the progression to the final. Account for entries that already have this
        final.heat.progression!.previous!.entries.push({
          sourceIds: [heat.heat.heatId],
          bowNumber: finalEntry.bowNumber,
          startPosition: calculatedStartPosition,
        });

        // Ensure next exists for the heat
        if (
          !heat.heat.progression!.next!.some(
            (heatNextEntry) => heatNextEntry.id === final.heat.heatId,
          )
        ) {
          heat.heat.progression!.next!.push({ id: final.heat.heatId });

          // Stable ordering for testing
          heat.heat.progression!.next!.sort(
            (a, b) => Number(a.id) - Number(b.id),
          );
        }

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
 * @param progressionEntrySet the set of entries by progression info, used to check for duplicates across heats and when we don't have times. Format startPosition_heatIds (comma separated)
 * @param entrySet the set of entries that have been calculated, used to check complex progression duplicates. Format: Team Name_Team Entry Letter
 * @throws {Error} when a duplicate entry is detected
 */
function assignProgressionForFinal(
  heats: Map<number, HeatWithLanesEntry>,
  final: HeatWithLanesEntry,
  progressionEntrySet: Set<string>,
  entrySet: Set<string>,
) {
  // For each of the entries in the heat
  final.heat.entries.forEach((finalEntry) => {
    const entryRegex =
      /([1-9]+)(?:st|nd|rd|th) (?:(?:(?:h|heat)\s?([1-9]+))|(?:fastest))/i.exec(
        finalEntry.teamName,
      );

    // If we didn't get anything back from the regex, that means
    // we've lost the progression information due to the results being
    // populated. So, go back through and determine progression information
    // based on who came from where
    if (entryRegex === null) {
      buildProgressionByResults(
        [...heats.values()],
        final,
        finalEntry,
        entrySet,
        progressionEntrySet,
      );
      return;
    }

    // Create the start position
    let startPosition = parseInt(entryRegex[1]);

    // Build the source heats. Regex group 2 is the heat number, so if we have that, use it. Otherwise, it's all
    const sourceHeats = entryRegex[2]
      ? [heats.get(parseInt(entryRegex[2]))!]
      : [...heats.values()];

    // Check if we got a heat that's undefined, throw if so (bad ID)
    if (sourceHeats[0] === undefined) {
      throw new Error(`Missing heat #${entryRegex[2]}`);
    }
    // Ensure next is set for each of the finals
    sourceHeats.forEach((sourceHeat) => {
      // If we haven't seen this heat in this final before
      if (
        !sourceHeat.heat.progression!.next?.some(
          (nextHeat) => nextHeat.id === final.heat.heatId,
        )
      ) {
        // And push the final ID
        sourceHeat.heat.progression!.next!.push({ id: final.heat.heatId });

        // Stable order for testing
        sourceHeat.heat.progression!.next!.sort(
          (a, b) => Number(a.id) - Number(b.id),
        );
      }
    });

    const progressionHash = `${startPosition}_${sourceHeats
      .map((heat) => heat.heat.heatId)
      .toSorted()
      .join(",")}`;

    // Check progression set
    if (progressionEntrySet.has(progressionHash)) {
      throw new Error(
        `Detected a duplicate progression entry - start position: ${startPosition} source IDs: [${sourceHeats
          .map((heat) => heat.heat.heatId)
          .join(",")}]`,
      );
    }

    // Save the progression set
    progressionEntrySet.add(progressionHash);

    // -1 for each entry we have seen that is formatted *exactly* like this.
    // So, if we already saw 1st H1 we want 2nd H1 to be 1st H1 out of the rest
    // But we want 1st Fastest to not be 0th Fastest
    startPosition -= final.heat.progression!.previous!.entries.filter(
      (entry) =>
        entry.startPosition! < startPosition && // Exclude anything with a higher number than this
        entry.sourceIds.every((id) =>
          sourceHeats.some((sourceHeat) => sourceHeat.heat.heatId == id),
        ) &&
        sourceHeats
          .map((sourceHeat) => sourceHeat.heat.heatId)
          .every((id) => entry.sourceIds.includes(id)),
    ).length;

    // Otherwise, we build progression based on the entry regex
    final.heat.progression!.previous!.entries.push({
      sourceIds: sourceHeats.map((sourceHeat) => sourceHeat.heat.heatId),
      bowNumber: finalEntry.bowNumber,
      startPosition: startPosition - 1,
    });

    // Build the final array of entries
    let entries: Entry[] = [];
    sourceHeats.forEach((heat) => {
      entries = entries.concat(heat.heat.entries);
    });

    // If we have no finish times at all, we can ignore processing progression
    if (
      !sourceHeats.some((sourceHeat) =>
        sourceHeat.heat.entries.some((entry) => entry.finishTime !== undefined),
      )
    ) {
      return;
    }

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

    if (startPosition > entries.length) {
      throw new Error(`Failed to find a match for ${entryRegex[0]}`);
    }

    const entry: EntryBase = {
      teamName: entries[startPosition - 1].teamName,
      teamEntryLetter: entries[startPosition - 1].teamEntryLetter,
    };

    const entryHash = `${entry.teamName}_${entry.teamEntryLetter}`;

    // Check entry set
    if (entrySet.has(entryHash)) {
      throw new Error(
        `Detected a duplicate entry - ${entry.teamName} ${
          entry.teamEntryLetter ?? ""
        }`,
      );
    }

    // Back-compute the team name for the final results
    finalEntry.teamName = entry.teamName;
    finalEntry.teamEntryLetter = entry.teamEntryLetter;

    // Add the entries
    entrySet.add(entryHash);
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

    // Check for duplicate entries in the heats
    const allHeatEntries = new Set<string>();
    heatMap.forEach((entryCheckHeat) => {
      entryCheckHeat.heat.entries.forEach((entryCheckEntry) => {
        if (
          allHeatEntries.has(
            `${entryCheckEntry.teamName}_${entryCheckEntry.teamEntryLetter}`,
          )
        ) {
          throw new Error(
            `Found a duplicate entry ${entryCheckEntry.teamName} ${
              entryCheckEntry.teamEntryLetter ?? ""
            }`,
          );
        }

        allHeatEntries.add(
          `${entryCheckEntry.teamName}_${entryCheckEntry.teamEntryLetter}`,
        );
      });
    });

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
          next: [],
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
    // Duplicate checking sets
    const finalNameSet = new Set<string>(); // Final names
    const entryProgressionSet = new Set<string>(); // Entries in terms of progression (needed for cases where we can't yet calculate)
    const calculatedEntrySet = new Set<string>(); // Entries in terms of real entries (needed for cases where 1st fastest and 1st point at the same)

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

      // Check the final name, ensure it's not a duplicate
      if (finalNameSet.has(finalName)) {
        throw new Error(`Found a duplicate final ${finalName}`);
      }

      // Assign progression for the final
      final.heat.progression = {
        description: finalName,
        previous: {
          entries: [],
        },
      };
      assignProgressionForFinal(
        heatMap,
        final,
        entryProgressionSet,
        calculatedEntrySet,
      );

      // Save the final name
      finalNameSet.add(finalName);
    });
  });
}
