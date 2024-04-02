import { RegattaService } from "@qra-website/core";
import { CollectionItem, EntityItem } from "electrodb";

/**
 * Method that converts a break as retrieved from the database to a break with more useful typing information
 * @param dbBreak the break that has been retrieved from the database
 * @returns the processed break with better type information
 */
export function convertDbBreakToBreak(
  dbBreak: EntityItem<typeof RegattaService.entities.break>,
) {
  return {
    ...dbBreak,
    scheduledStart: new Date(dbBreak.scheduledStart),
  };
}

/**
 * Converts a heat (as it would be returned from the DB) to one that can be used
 * in the frontend (e.g., with more useful types)
 * @param heat the heat to convert
 * @returns the converted heat, with more useful typings
 */
export function convertDbHeatToHeat(
  heat: EntityItem<typeof RegattaService.entities.heat>,
) {
  // For each entry, add in computed finish time and rename finish time to raw finish time
  const entriesNoDelta = heat.entries.map((entry) => {
    // Compute the final finish time
    let finalFinishTime: number | undefined;

    // If we have a finish time
    if (entry.finishTime) {
      // If we have a non-warning penalty
      if (entry.penalty && entry.penalty.type !== "warning") {
        // If it's a time penalty, apply it
        if (entry.penalty.type === "time") {
          // Compute the final finish time based on the raw + penalty
          finalFinishTime =
            entry.finishTime + (entry.penalty.time ? entry.penalty.time : 0);
        }

        // If it's a DSQ, just let it be undefined
      } else {
        // If we don't have a penalty, just use the raw
        finalFinishTime = entry.finishTime;
      }
    }

    // Now remove the original finish time attribute and keep only raw and final
    const result: Omit<typeof entry, "finishTime"> & {
      rawFinishTime?: number;
      finalFinishTime?: number;
    } = {
      ...entry,
      rawFinishTime: entry.finishTime,
      finalFinishTime: finalFinishTime,
    };

    // Don't use inline so we get better typing on this
    return result;
  });

  // Order in the following way
  // Start with entries with final finish time (ordered by that)
  // then, DNFs (ordered by bow number)
  // Then, DSQs (ordered by raw finish order)
  // Then, fall back to bow number order
  const entriesSorted = entriesNoDelta.toSorted((a, b) => {
    if (a.finalFinishTime && b.finalFinishTime) {
      return a.finalFinishTime - b.finalFinishTime;
    } else if (a.finalFinishTime) {
      return -1; // A is less than (closer to start/top)
    } else if (b.finalFinishTime) {
      return 1;
    } else if (a.didFailToFinish && b.didFailToFinish) {
      return a.bowNumber - b.bowNumber;
    } else if (a.didFailToFinish) {
      return -1;
    } else if (b.didFailToFinish) {
      return 1;
    } else if (a.penalty && b.penalty && a.rawFinishTime && b.rawFinishTime) {
      return a.rawFinishTime - b.rawFinishTime;
    } else if (a.penalty) {
      return -1;
    } else if (b.penalty) {
      return 1;
    } else {
      return a.bowNumber - b.bowNumber;
    }
  });

  // Types that the final entries should be
  type BaseEntry = (typeof entriesNoDelta)[0];
  type EntryWithDeltas = BaseEntry & {
    deltaToWinner: number | undefined;
    deltaToNext: number | undefined;
  };

  const entriesWithDelta: EntryWithDeltas[] = [];

  // Iterate through the entries
  for (let i = 0; i < entriesSorted.length; i++) {
    // If we don't have a final finish time for this crew, just put them in without one
    if (entriesSorted[i].finalFinishTime === undefined) {
      entriesWithDelta.push({
        ...entriesSorted[i],
        deltaToNext: undefined,
        deltaToWinner: undefined,
      });
      continue; // Don't process more
    }

    if (i === 0) {
      // If this is the first, delta to next/winner is 0
      entriesWithDelta.push({
        ...entriesSorted[i],
        deltaToNext: 0,
        deltaToWinner: 0,
      });
    } else {
      // Otherwise, populate the deltas. The fact that this is sorted (and this has a final finish time) ensures
      // that 0 and i - 1 will both have final finish times
      entriesWithDelta.push({
        ...entriesSorted[i],
        deltaToNext:
          entriesSorted[i].finalFinishTime! -
          entriesSorted[i - 1].finalFinishTime!,
        deltaToWinner:
          entriesSorted[i].finalFinishTime! - entriesSorted[0].finalFinishTime!,
      });
    }
  }

  // Return the final, processed list
  return {
    ...heat,
    scheduledStart: new Date(heat.scheduledStart),
    entries: entriesWithDelta,
  };
}

/**
 * Converts a regatta (as it would be returned from the DB) to one containing
 * more useful typings for easier use in the frontend
 * @param regattaSummary the regatta as returned from the DB
 * @returns a regatta created with more useful typings
 */
export function convertDbRegattaSummaryToRegattaSummary(
  regattaSummary: EntityItem<typeof RegattaService.entities.regatta>,
) {
  return {
    ...regattaSummary,
    startDate: new Date(regattaSummary.startDate),
    endDate: new Date(regattaSummary.endDate),
  };
}

/**
 * Method to convert the DB returned regatta details to one with more useful types
 * @param regattaDetails the DB returned regatta details to display
 * @returns regatta details with more useful types, or null if the returned data has no regatta
 * @throws {Error} if the passed-in regatta details contain more than one regatta
 */
export function convertDbRegattaDetailsToRegattaDetails(
  regattaDetails: CollectionItem<typeof RegattaService, "regatta">,
) {
  // If we got no regatta
  if (regattaDetails.regatta.length === 0) {
    return null; // Return null
  } else if (regattaDetails.regatta.length !== 1) {
    // If we somehow got more than one regatta, throw
    throw new Error(
      `Invalid input - regatta details must have exactly one regatta (found ${regattaDetails.regatta.length})`,
    );
  }

  // Otherwise, return, call the converters for the subtypes
  return {
    regatta: convertDbRegattaSummaryToRegattaSummary(regattaDetails.regatta[0]),
    heat: regattaDetails.heat.map(convertDbHeatToHeat),
    break: regattaDetails.break.map(convertDbBreakToBreak),
  };
}
