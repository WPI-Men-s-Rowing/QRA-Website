import { RegattaService } from "@qra-website/core/dynamo-db";
import { CreateEntityItem } from "electrodb";
import { LakeScheduleLanesEntry } from "../types/duel-types.ts";

/**
 * Takes a string, and returns the same string with the first character made uppercase
 * @param input the string to modify
 * @returns the inputted string with the first character made uppercase
 */
function toFirstUppercase(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Takes a number and adds the ordinal to it, and then returns the ordinal
 * @param number the number to add the ordinal to
 * @returns the number and the ordinal in a string
 */
function addOrdinal(number: number) {
  const pr = new Intl.PluralRules("en-US", { type: "ordinal" });

  const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
  ]);

  const rule = pr.select(number);
  const suffix = suffixes.get(rule);
  return `${number}${suffix}`;
}

/**
 * Parses a number and returns undefined if the parsing fails
 * @param number the number to attempt to parse
 * @returns the number, or undefined if the number is not valid
 */
function parseIntOrUndefined(number: string) {
  try {
    const result = parseInt(number);
    return isNaN(result) ? undefined : result;
  } catch (_) {
    return undefined;
  }
}

/**
 * Converts a time string to a time value in milliseconds. In the form HH:MM:SS.MS, where hours are optional
 * and all other fields are required
 * @param time the time to convert to milliseconds
 * @returns the time, converted to milliseconds
 * @throws {Error} if the provided time is malformed
 */
function stringToTimeInMs(time: string) {
  // Apply a simple time regex to the time
  const timeRegex = /(?:([0-9]+):)?([0-9]+):([0-9]+).([0-9]+)/gm.exec(time);

  // If the time regex is invalid
  if (timeRegex === null) {
    // Throw
    throw new Error(`Invalid time ${time}`);
  }

  // Parse the time. Hours are optional, but the rest are not, so force that
  const hours = timeRegex[1] !== "" ? parseInt(timeRegex[1]) : 0;
  const min = parseInt(timeRegex[2]);
  const sec = parseInt(timeRegex[3]);
  const ms = parseInt(timeRegex[4]);

  // Process the finish time
  return hours * 60 * 60 * 1000 + min * 60 * 1000 + sec * 1000 + ms;
}

/**
 * Method that converts a boat class as returned from the FileMaker DB in the
 * event parameter to one that can be stored in DynamoDB
 * @param boatClass the boat class retrieved from FileMaker
 * @returns a boat class that conforms to the DynamoDB boat class type
 */
function fileMakerBoatClassToBoatClass(
  boatClass: string,
): CreateEntityItem<typeof RegattaService.entities.heat>["type"]["boatClass"] {
  // Figure out what to do based on the boat class
  switch (boatClass) {
    case "8":
      return "8+";
    case "4+":
      return "4+";
    case "4": // The QRA doesn't support 4- and some coaches use this instead of 4+...
      return "4+";
    case "2x":
      return "2x";
    case "1x":
      return "1x";
    default:
      // If the boat class is not one of the QRA boat classes, throw
      throw new Error(`Invalid heat event boat class: ${boatClass}`);
  }
}

/**
 * Reads a FileMaker lake schedule lanes entry and converts it to an array containing entry name, seed (letter, sometimes
 * accurate, sometimes not), and finish time (which can sometimes be e.g., DNF or SCR)
 * @returns an array, containing the data for each lane. Some lanes may have all empty strings
 */
function fileMakerEntriesToEntriesArray(
  lakeScheduleLanesEntry: LakeScheduleLanesEntry,
) {
  // This is gross but the easiest way of doing this
  return [
    {
      teamName: lakeScheduleLanesEntry.entry0,
      seed: lakeScheduleLanesEntry.entryseed0,
      time: lakeScheduleLanesEntry.time0,
    },
    {
      teamName: lakeScheduleLanesEntry.entry1,
      seed: lakeScheduleLanesEntry.entryseed1,
      time: lakeScheduleLanesEntry.time1,
    },
    {
      teamName: lakeScheduleLanesEntry.entry2,
      seed: lakeScheduleLanesEntry.entryseed2,
      time: lakeScheduleLanesEntry.time2,
    },
    {
      teamName: lakeScheduleLanesEntry.entry3,
      seed: lakeScheduleLanesEntry.entryseed3,
      time: lakeScheduleLanesEntry.time3,
    },
    {
      teamName: lakeScheduleLanesEntry.entry4,
      seed: lakeScheduleLanesEntry.entryseed4,
      time: lakeScheduleLanesEntry.time4,
    },
    {
      teamName: lakeScheduleLanesEntry.entry5,
      seed: lakeScheduleLanesEntry.entryseed5,
      time: lakeScheduleLanesEntry.time5,
    },
    {
      teamName: lakeScheduleLanesEntry.entry6,
      seed: lakeScheduleLanesEntry.entryseed6,
      time: lakeScheduleLanesEntry.time6,
    },
  ];
}

/**
 * Processes the raw entries list returned by the above function and converts it to the final entries list
 * that can be used by DynamoDB
 * @param rawEntries the raw entries list returned by the above
 * @returns the final entries list to be used by DynamoDB
 */
function rawEntriesToEntries(
  rawEntries: ReturnType<typeof fileMakerEntriesToEntriesArray>,
) {
  // Now create the entries
  const result: CreateEntityItem<
    typeof RegattaService.entities.heat
  >["entries"] = [];

  // Team to number of entries that team has
  const teamsWithNoSeed = new Set<string>();

  for (let i = 0; i < rawEntries.length; i++) {
    const rawEntry = rawEntries[i];

    // Skip if there is no team name
    if (rawEntry.teamName === "") {
      continue;
    }

    // Team entry letter, e.g., the A in WPI A
    let teamEntryLetter: string | undefined;
    if (rawEntry.seed !== "") {
      // If we have that provided, just use it
      teamEntryLetter = rawEntry.seed;
    } else if (
      rawEntries.filter((entry) => entry.teamName === rawEntry.teamName)
        .length > 1
    ) {
      // Validate we haven't seen this team before
      if (teamsWithNoSeed.has(rawEntry.teamName)) {
        // If we have throw
        throw new Error(
          `Found multiple entries for a team (${rawEntry.teamName}) with no seed`,
        );
      }

      // If we don't and the team isn't unique, it's A. That happens sometimes in the data
      teamEntryLetter = "A";

      // Mark it as us having seen this team
      teamsWithNoSeed.add(rawEntry.teamName);
    }

    let finishTime: number | undefined;
    let didFailToFinish: boolean | undefined;
    if (rawEntry.time === "SCR" || rawEntry.time === "DNF") {
      // Handle the scratch/DNF case
      didFailToFinish = true;
    } else if (rawEntry.time !== "") {
      finishTime = stringToTimeInMs(rawEntry.time);
    }

    result.push({
      bowNumber: i,
      teamName: rawEntry.teamName,
      teamEntryLetter,
      finishTime,
      didFailToFinish,
    });
  }

  return result;
}

/**
 * Method that creates a duel regatta heat from the QRA lake schedule type. NOTE: THIS IGNORES PROGRESSION
 * @param regattaId the ID of the regatta to attach the heat to
 * @param lakeScheduleLanesEntry the lake schedule lanes entry that forms this heat in the FileMaker DB
 * @returns the arguments to create a duel regatta heat in the DB
 * @throws {Error} if the lake schedule entry is invalid for any number of reasons - invalid event type,
 * invalid gender, invalid boat class, or invalid time on an entry
 */
export function createDuelHeat(
  regattaId: string,
  lakeScheduleLanesEntry: LakeScheduleLanesEntry,
): CreateEntityItem<typeof RegattaService.entities.heat> & { heatId: string } {
  // Process the event regex. The /s create a regex automatically
  const regexResult =
    /(?:(B|G)([1-9])(?:st|nd|rd|th)|(M|W)([1-9])?(V|v|N|n))(8|4\+|4|1x|2x)/gm.exec(
      lakeScheduleLanesEntry.event,
    );

  // Validate we got a safe result back, throw if not
  if (regexResult === null) {
    throw new Error(`Invalid heat event: ${lakeScheduleLanesEntry.event}`);
  }

  // Determine the gender of the heat
  let displayGender: string;
  let gender: CreateEntityItem<
    typeof RegattaService.entities.heat
  >["type"]["gender"];
  if (regexResult[3] === "M" || regexResult[1] === "B") {
    gender = "men"; // If it's M or B, it's men

    // Display gender based on the expanded result
    if (regexResult[3] === "M") {
      displayGender = "men";
    } else {
      displayGender = "boy";
    }
  } else if (regexResult[3] === "W" || regexResult[1] === "G") {
    gender = "women"; // If it's W or G, it's women
    if (regexResult[3] === "W") {
      displayGender = "women";
    } else {
      displayGender = "girl";
    }
  } else {
    // Otherwise the heat is invalid.
    // Technically this should never happen (the regex will fail first)
    throw new Error(
      `Invalid heat event gender: ${lakeScheduleLanesEntry.event}`,
    );
  }

  // Get the boat class
  const boatClass = fileMakerBoatClassToBoatClass(regexResult[6]);

  // This is the raw list of entries in the database. Some of these may be nonsensical but will be processed
  const entries = rawEntriesToEntries(
    fileMakerEntriesToEntriesArray(lakeScheduleLanesEntry),
  );

  // Determine if all entries have a finish time
  const allEntriesHaveFinish = entries.every(
    (entry) => entry.finishTime ?? entry.didFailToFinish,
  );

  const scheduledDate = new Date(
    `${lakeScheduleLanesEntry.racedatetime} GMT-0400`,
  );

  // Validate that if any entries have results, or the time is in the past, all do
  if (
    !allEntriesHaveFinish &&
    (entries.some((entry) => entry.finishTime ?? entry.didFailToFinish) ||
      scheduledDate < new Date())
  ) {
    throw new Error("Heat entry missing finish result");
  }

  // Now create the heat
  return {
    heatId: lakeScheduleLanesEntry.id.toString(),
    regattaId: regattaId,
    scheduledStart: scheduledDate.getTime(),
    type: {
      gender,
      // Take the number from the regex when possible. Otherwise, for collegiate 1st 8, it's not specified so assume.
      // Then, add the ordinal
      displayName: `${toFirstUppercase(displayGender)}'s ${addOrdinal(
        parseIntOrUndefined(regexResult[2]) ??
          parseIntOrUndefined(regexResult[4]) ??
          1,
      )} ${
        // If it's collegiate, we have varsity or novice. Otherwise, we don't, leave it blank.
        // The trailing space is to avoid strange formatting
        regexResult[5]?.toUpperCase() === "N"
          ? "Novice "
          : regexResult[5]?.toUpperCase() === "V"
            ? "Varsity "
            : ""
      }${boatClass}`,
      boatClass,
    },
    entries,
    // If all entries have a finish time, then we're official. Otherwise, scheduled
    status: allEntriesHaveFinish ? "official" : "scheduled",
  };
}
