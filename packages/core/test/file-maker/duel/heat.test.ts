import { CreateEntityItem } from "electrodb";
import { describe, expect, test } from "vitest";
import { RegattaService } from "../../../src/dynamo-db/services.ts";
import { createDuelHeat } from "../../../src/file-maker/duel/heat.ts";
import { BREAK_HOST, WESLEYEAN_BREAK, WPI_BREAK } from "./examples/break.ts";
import {
  ASSUMPTION_W3V8_DNF,
  CLARK_WV8_GF,
  EMPTY_ENTRY,
  HCR_WV8_SCHEDULED,
  WPI_MV4_SEED,
  WPI_MV8_NO_ENTRIES,
  WPI_MV8_RESULTS,
  WPI_W2V8_SCR,
  WPI_W4V8_SEED,
} from "./examples/heat.ts";

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

describe("createDuelHeat", () => {
  test("Break throws", () => {
    expect(() => createDuelHeat("asdf", WPI_BREAK)).toThrow(
      "Invalid heat event",
    );
    expect(() => createDuelHeat("123", WESLEYEAN_BREAK)).toThrow(
      "Invalid heat event",
    );
    expect(() => createDuelHeat("456", BREAK_HOST)).toThrow(
      "Invalid heat event",
    );
  });

  test("Empty throws", () => {
    expect(() => createDuelHeat("111", EMPTY_ENTRY)).toThrow(
      "Invalid heat event",
    );
  });

  test("Malformed event throws", () => {
    expect(() =>
      createDuelHeat("123", {
        ...WPI_MV8_RESULTS,
        event: "YV8",
      }),
    ).toThrow("Invalid heat event");

    expect(() =>
      createDuelHeat("8908", {
        ...WPI_MV8_NO_ENTRIES,
        event: "MV17",
      }),
    ).toThrow("Invalid heat event");

    expect(() =>
      createDuelHeat("a", {
        ...CLARK_WV8_GF,
        event: "MUV8",
      }),
    ).toThrow("Invalid heat event");

    expect(() =>
      createDuelHeat("b", {
        ...CLARK_WV8_GF,
        event: "asdafljas;dfljasdf",
      }),
    ).toThrow("Invalid heat event");
  });

  test("Multiple entries with no seed throws", () => {
    expect(() =>
      createDuelHeat("a", {
        ...WPI_MV8_NO_ENTRIES,
        entry0: "WPI",
        time0: "6:13.4",
        entry1: "WPI",
        time1: "7:15.4",
      }),
    ).toThrow("Found multiple entries");
  });

  test("Invalid time value throws", () => {
    expect(() =>
      createDuelHeat("b", {
        ...WPI_MV8_RESULTS,
        time1: "this is a bad time",
      }),
    ).toThrow("Invalid time");
  });

  test("Missing one result throws", () => {
    expect(() =>
      createDuelHeat("test", {
        ...CLARK_WV8_GF,
        entry1: "Clark",
        time1: "",
        entry2: "WPI",
        time2: "6:13.4",
      }),
    ).toThrow("Heat entry missing finish result");
  });

  test("Missing results for completed event throws", () => {
    expect(() =>
      createDuelHeat("id", {
        ...EMPTY_ENTRY,
        event: "MV8",
        racedate: "1/1/2004",
        racedateUnix: "2004-01-01",
        racetime: "08:00:00",
        racedatetime: "1/1/2004 08:00:00",
        entry1: "Wesleyean",
      }),
    ).toThrow("Heat entry missing finish result");
  });

  test("Results for scheduled event throws", () => {
    // Date in the future
    const dateInFuture = new Date(new Date().getTime() + 100000);

    expect(() =>
      createDuelHeat("test", {
        ...WPI_MV8_RESULTS,
        racedate: dateInFuture.toDateString(),
        racedatetime: dateInFuture.toString(),
        racedateUnix: dateInFuture.toDateString(),
        racetime: dateInFuture.toTimeString(),
      }),
    ).toThrow("scheduled event with results");
  });

  test("All class/gender combinations", () => {
    const boatClasses = ["8", "4+", "4", "2x", "1x"] as const;
    const collegiateGenders = ["M", "W"] as const;
    const collegiateLevels = ["V", "N"] as const;
    const collegiateNumbers = ["", "2", "3"] as const;
    const highSchoolGenders = ["B", "G"] as const;
    const highSchoolNumbers = ["1st", "2nd", "3rd", "4th"] as const;

    const boatClassesToType: Record<
      string,
      CreateEntityItem<typeof RegattaService.entities.heat>["type"]["boatClass"]
    > = { "8": "8+", "4+": "4+", "4": "4+", "2x": "2x", "1x": "1x" };
    const gendersToType: Record<
      string,
      CreateEntityItem<typeof RegattaService.entities.heat>["type"]["gender"]
    > = {
      M: "men",
      W: "women",
      B: "men",
      G: "women",
    };
    const gendersToDisplayGender: Record<string, string> = {
      M: "Men's",
      W: "Women's",
      B: "Boy's",
      G: "Girl's",
    };

    boatClasses.forEach((boatClass) => {
      collegiateGenders.forEach((gender) => {
        collegiateLevels.forEach((level) => {
          collegiateNumbers.forEach((number) => {
            expect(
              createDuelHeat("123", {
                ...EMPTY_ENTRY,
                event: `${gender}${number}${level}${boatClass}`,
              }),
            ).toStrictEqual({
              regattaId: "123",
              heatId: EMPTY_ENTRY.id.toString(),
              type: {
                boatClass: boatClassesToType[boatClass],
                gender: gendersToType[gender],
                displayName: `${gendersToDisplayGender[gender]} ${addOrdinal(
                  parseIntOrUndefined(number) ?? 1,
                )} ${level === "V" ? "Varsity" : "Novice"} ${
                  boatClassesToType[boatClass]
                }`,
              },
              scheduledStart: Date.parse(
                `${EMPTY_ENTRY.racedatetime} GMT-0400`,
              ),
              status: "official",
              entries: [],
            } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
          });
        });
      });

      highSchoolGenders.forEach((gender) => {
        highSchoolNumbers.forEach((number) => {
          expect(
            createDuelHeat("bbb", {
              ...EMPTY_ENTRY,
              event: `${gender}${number}${boatClass}`,
            }),
          ).toStrictEqual({
            regattaId: "bbb",
            heatId: EMPTY_ENTRY.id.toString(),
            type: {
              gender: gendersToType[gender],
              boatClass: boatClassesToType[boatClass],
              displayName: `${gendersToDisplayGender[gender]} ${number} ${boatClassesToType[boatClass]}`,
            },
            scheduledStart: Date.parse(`${EMPTY_ENTRY.racedatetime} GMT-0400`),
            status: "official",
            entries: [],
          } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
        });
      });
    });
  });

  test("Event with DNF", () => {
    expect(createDuelHeat("duel", ASSUMPTION_W3V8_DNF)).toEqual({
      regattaId: "duel",
      heatId: ASSUMPTION_W3V8_DNF.id.toString(),
      type: {
        boatClass: "8+",
        gender: "women",
        displayName: "Women's 3rd Varsity 8+",
      },
      scheduledStart: Date.parse(
        ASSUMPTION_W3V8_DNF.racedatetime + " GMT-0400",
      ),
      status: "official",
      entries: [
        {
          teamName: "Mt. Holyoke College",
          bowNumber: 3,
          finishTime: 8 * 60 * 1000 + 24.55 * 1000,
        },
        {
          teamName: "Coast Guard",
          bowNumber: 4,
          didFailToFinish: true,
        },
        {
          teamName: "Assumption",
          bowNumber: 5,
          finishTime: 8 * 60 * 1000 + 28.15 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Event with SCR", () => {
    expect(createDuelHeat("heat", WPI_W2V8_SCR)).toEqual({
      regattaId: "heat",
      heatId: WPI_W2V8_SCR.id.toString(),
      type: {
        boatClass: "8+",
        gender: "women",
        displayName: "Women's 2nd Varsity 8+",
      },
      scheduledStart: Date.parse(WPI_W2V8_SCR.racedatetime + " GMT-0400"),
      status: "official",
      entries: [
        {
          teamName: "Tufts",
          bowNumber: 1,
          finishTime: 7 * 60 * 1000 + 4.24 * 1000,
        },
        {
          teamName: "WPI",
          bowNumber: 2,
          finishTime: 7 * 60 * 1000 + 4.1 * 1000,
        },
        {
          teamName: "William Smith",
          bowNumber: 3,
          finishTime: 7 * 60 * 1000 + 18.39 * 1000,
        },
        {
          teamName: "Clark",
          bowNumber: 4,
          finishTime: 8 * 60 * 1000 + 7.76 * 1000,
        },
        {
          teamName: "Skidmore",
          bowNumber: 5,
          didFailToFinish: true,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("WPI Men's Varsity 8+", () => {
    expect(createDuelHeat("all", WPI_MV8_RESULTS)).toEqual({
      regattaId: "all",
      heatId: WPI_MV8_RESULTS.id.toString(),
      type: {
        gender: "men",
        boatClass: "8+",
        displayName: "Men's 1st Varsity 8+",
      },
      scheduledStart: Date.parse(WPI_MV8_RESULTS.racedatetime + " GMT-0400"),
      status: "official",
      entries: [
        {
          teamName: "Wesleyan",
          bowNumber: 1,
          finishTime: 5 * 60 * 1000 + 54.6 * 1000,
        },
        {
          teamName: "WPI",
          bowNumber: 2,
          finishTime: 6 * 60 * 1000 + 1.21 * 1000,
        },
        {
          teamName: "Colby",
          bowNumber: 3,
          finishTime: 6 * 60 * 1000 + 9.5 * 1000,
        },
        {
          teamName: "Hamilton",
          bowNumber: 4,
          finishTime: 6 * 60 * 1000 + 7.29 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Entries with Seed", () => {
    expect(createDuelHeat("seed", WPI_MV4_SEED)).toEqual({
      regattaId: "seed",
      heatId: WPI_MV4_SEED.id.toString(),
      type: {
        gender: "men",
        boatClass: "4+",
        displayName: "Men's 1st Varsity 4+",
      },
      scheduledStart: Date.parse(WPI_MV4_SEED.racedatetime + " GMT-0400"),
      status: "official",
      entries: [
        {
          teamName: "WPI",
          teamEntryLetter: "A",
          bowNumber: 1,
          finishTime: 7 * 60 * 1000 + 45.4 * 1000,
        },
        {
          teamName: "Hamilton",
          bowNumber: 2,
          finishTime: 8 * 60 * 1000 + 1.53 * 1000,
        },
        {
          teamName: "WPI",
          teamEntryLetter: "B",
          bowNumber: 3,
          finishTime: 7 * 60 * 1000 + 55.5 * 1000,
        },
        {
          teamName: "Conn College",
          bowNumber: 4,
          finishTime: 9 * 60 * 1000 + 15.7 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Entries with Seed missing A", () => {
    expect(createDuelHeat("noSeed", WPI_W4V8_SEED)).toEqual({
      regattaId: "noSeed",
      heatId: WPI_W4V8_SEED.id.toString(),
      type: {
        gender: "women",
        boatClass: "8+",
        displayName: "Women's 4th Varsity 8+",
      },
      scheduledStart: Date.parse(WPI_W4V8_SEED.racedatetime + " GMT-0400"),
      status: "official",
      entries: [
        {
          teamName: "WPI",
          bowNumber: 1,
          finishTime: 8 * 60 * 1000 + 20.03 * 1000,
        },
        {
          teamName: "Bates",
          bowNumber: 2,
          teamEntryLetter: "A",
          finishTime: 7 * 60 * 1000 + 23.88 * 1000,
        },
        {
          teamName: "Bates",
          bowNumber: 3,
          teamEntryLetter: "B",
          finishTime: 7 * 60 * 1000 + 58.09 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Scheduled Heat", () => {
    const startTimeInFuture = new Date(new Date().getTime() + 123456);
    expect(
      createDuelHeat("HCR", {
        ...HCR_WV8_SCHEDULED,
        racedate: startTimeInFuture.toDateString(),
        racetime: startTimeInFuture.toTimeString(),
        racedateUnix: startTimeInFuture.toDateString(),
        racedatetime: startTimeInFuture.toString(),
      }),
    ).toEqual({
      regattaId: "HCR",
      heatId: HCR_WV8_SCHEDULED.id.toString(),
      type: {
        gender: "women",
        boatClass: "8+",
        displayName: "Women's 1st Varsity 8+",
      },
      scheduledStart: Date.parse(startTimeInFuture.toString()),
      status: "scheduled",
      entries: [
        {
          teamName: "Holy Cross",
          bowNumber: 1,
        },
        {
          teamName: "Smith",
          bowNumber: 2,
        },
        {
          teamName: "Colgate",
          bowNumber: 3,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });
});