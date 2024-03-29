import { RegattaService, TeamService } from "@qra-website/core";
import { webcrypto } from "node:crypto";

/* @ts-expect-error Required since we don't have any type data on the polyfill */ /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
globalThis.crypto = webcrypto as Crypto;

import crypto from "crypto";
import { CreateEntityItem, EntityItem } from "electrodb";
import { auth } from "./auth.ts";

// How many milliseconds are in a day, for random value generation
const dayInMilliseconds = 1000 * 60 * 60 * 24;

// List of teams we can use here
const teams = [
  "WPI",
  "Tufts",
  "MIT",
  "Harvard",
  "Dartmouth",
  "Northeastern",
  "Bates",
  "Yale",
  "Brown",
  "Princeton",
  "Columbia",
  "Penn",
  "Cornell",
];

/**
 * Function that creates a completely random regatta
 * @returns The data on the randomly generated regatta
 */
async function createRandomRegatta() {
  // Create a random date, either one week before or one week after now, or now
  const date =
    Date.now() + dayInMilliseconds * [-7, 7, 0][crypto.randomInt(0, 3)];

  // Array type, being the possible types of regatta we can have
  const typePossibilities =
    RegattaService.entities.regatta.schema.attributes.type.type;

  const regattaType =
    typePossibilities[crypto.randomInt(0, typePossibilities.length)];

  const host =
    regattaType === "duel" ? teams[crypto.randomInt(0, teams.length)] : "QRA"; // Randomly determined host, only duels have hosts

  const regatta = await RegattaService.entities.regatta
    .put({
      name: "Test Regatta", // Generate a type
      type: regattaType, // Randomly pick a type
      host: host,
      participantDescription: "New England Teams",
      rampClosed: regattaType !== "duel",
      distance: [2000, 5000][crypto.randomInt(0, 2)], // Pick either 2k or 5k cuz why not
      startDate: date,
      endDate: date + dayInMilliseconds * [0, 1][crypto.randomInt(0, 2)], // Regatta either ends same day or one day later
    })
    .go();

  return regatta.data;
}

/**
 * Function to create a random heat and insert it into the database. NOTE: This completely ignores progression info
 * @param regattaId the ID of the regatta the heat belongs to
 * @param regattaHasResults whether to randomly generate results
 * @param teams The teams that can be used to pick entries from
 * @returns the create args for the created heat
 */
function createRandomHeatCreateArgs(
  regatta: EntityItem<typeof RegattaService.entities.regatta>,
  teams: readonly string[],
): CreateEntityItem<typeof RegattaService.entities.heat> {
  const scheduledStart =
    regatta.startDate + crypto.randomInt(0, dayInMilliseconds); // Randomly generate a start time
  const regattaHasResults = scheduledStart + 1000 * 60 * 20 < Date.now(); // Whether the race has results. If now is more than 20 minutes after scheduled start
  const numEntries =
    regatta.type === "head" ? crypto.randomInt(15, 30) : crypto.randomInt(3, 7);
  const entries: EntityItem<typeof RegattaService.entities.heat>["entries"] =
    []; // Entries
  let status: EntityItem<typeof RegattaService.entities.heat>["status"]; // Heats status
  let delay: number | undefined; // The regattas delay time  (or undefined for none)
  const officialRegatta =
    regatta.type === "championship" && crypto.randomInt(0, 2) === 1; // Whether the regatta is official (e.g., should have segments and progression)

  // Create the entries
  for (let i = 0; i < numEntries; i++) {
    // Get a team, and then calculate the number of times that team has been in this heat before now
    const team = teams[crypto.randomInt(0, teams.length)];
    const numOtherTeams = entries.filter(
      (entry) => entry.teamName === team,
    ).length;
    // Randomly generate a finish time (if applicable) based on 5k/2k
    const finishTime = regattaHasResults
      ? regatta.distance === 5000
        ? crypto.randomInt(1000 * 60 * 20, 1000 * 60 * 22)
        : crypto.randomInt(1000 * 60 * 5, 1000 * 60 * 6)
      : undefined;

    // Create the entry
    entries.push({
      teamName: team,
      teamEntryLetter: (numOtherTeams > 0 ? numOtherTeams : 0).toString(),
      finishTime,
      bowNumber: i + 1,
      // Automatically interpolate segments. Divide into 3 sections
      segments:
        officialRegatta && finishTime
          ? [...Array(3).keys()].map((distanceNumber) => ({
              distance: (regatta.distance / 4) * (distanceNumber + 1), // Then multiply that + 1 by 1/4 of the distance (so 1st would be 500 over 2k, etc)
              time: (finishTime / 4) * (distanceNumber + 1), // Do the same for distance but with the finish time
            }))
          : undefined,
    });
  }

  // If the regatta has results,
  if (regattaHasResults) {
    status = crypto.randomInt(2) == 1 ? "unofficial" : "official"; // generate a random status based on the regatta having results
  } else {
    status = crypto.randomInt(2) == 1 ? "delayed" : "scheduled";

    // Determine whether the regatta is delayed
    if (status === "delayed") {
      delay = crypto.randomInt(0, 1000 * 60 * 60);
    }
  }

  // Extract type info about boat and gender, then randomly create those
  const heatType =
    RegattaService.entities.heat.schema.attributes.type.properties;
  const boatClassTypes = heatType.boatClass.type;
  const genderType = heatType.gender.type;
  const boatClass = boatClassTypes[crypto.randomInt(0, boatClassTypes.length)];
  const gender = genderType[crypto.randomInt(0, genderType.length)];

  // Now put type information together
  const type = {
    boatClass,
    gender,
    // Decide whether to create a manual display name randomly
    displayName:
      crypto.randomInt(0, 2) === 1
        ? `${gender}'s ${crypto.randomInt(1, 5)} Varsity ${boatClass}`
        : undefined,
  };

  // Return the parsed heat information
  return {
    regattaId: regatta.regattaId,
    type,
    scheduledStart,
    delay,
    status,
    entries,
  };
}

/**
 * Script that can be used to seed the database
 */
export async function script() {
  // Create a temporary admin user
  // Create a random account
  await auth.createUser({
    key: {
      providerId: "email",
      providerUserId: "example@example.com",
      password: "example",
    },
    attributes: {
      email: "example@example.com",
    },
  });

  // First, create all teams that may be of relevance
  await TeamService.entities.team
    .put(
      teams.map((team) => ({
        name: team,
      })),
    )
    .go();

  // Create random regattas with random heats
  for (let i = 0; i < 10; i++) {
    // Create the regatta, fetch its ID
    const regatta = await createRandomRegatta();

    // Now create 20 random create args, and then pass them to a bulk put (because more efficient)
    await RegattaService.entities.heat
      .put(
        [...Array(5).keys()].map(() =>
          createRandomHeatCreateArgs(regatta, teams),
        ),
      )
      .go();
  }
}
