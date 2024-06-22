import { CreateEntityItem } from "electrodb";
import { describe, expect, test } from "vitest";
import { RegattaService } from "../../../src/dynamo-db/services.ts";
import { createDuelHeat } from "../../../src/file-maker/duel/heat.ts";
import { BREAK_HOST, WESLEYEAN_BREAK, WPI_BREAK } from "./examples/break.ts";
import {
  ASSUMPTION_W3V8_DNF,
  CLARK_WV8_GF,
  EMPTY_ENTRY,
  HCR_WV4_BLANK_TIME,
  HCR_WV8_SCHEDULED,
  WPI_M3V8_3V_4V_SEED,
  WPI_MV4_SEED,
  WPI_MV8_NO_ENTRIES,
  WPI_MV8_RESULTS,
  WPI_W2V8_SCR,
  WPI_W4V8_SEED,
  WPI_WV4_B_SEED_NOT_IN_SEED,
  WPI_WV4_WHITE_SPACE_ENTRY,
  WPI_WV8_BLANK_ENTRY,
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

  test("Tie throws", () => {
    expect(() =>
      createDuelHeat("test", {
        ...EMPTY_ENTRY,
        event: "WV8",
        host: "WPI",
        entry1: "WPI",
        time1: "6:00.000",
        entry2: "Clark",
        time2: "6:00.000",
      }),
    ).toThrow("Found a tie");
  });

  test("Scheduled in past", () => {
    expect(
      createDuelHeat("id", {
        ...EMPTY_ENTRY,
        event: "MV8",
        racedate: "1/1/2004",
        racedateUnix: "2004-01-01",
        racetime: "08:00:00",
        racedatetime: "1/1/2004 08:00:00",
        entry1: "Wesleyan",
      }),
    ).toEqual({
      heatId: EMPTY_ENTRY.id.toString(),
      regattaId: "id",
      type: {
        gender: "men",
        displayName: "Men's 1st Varsity 8+",
        boatClass: "8+",
      },
      scheduledStart: Date.parse(`1/1/2004 08:00:00 GMT-0400`),
      status: "scheduled",
      entries: [
        {
          teamName: "Wesleyan",
          bowNumber: 1,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Results for scheduled event throws", () => {
    // Date in the future
    const dateInFuture = new Date(new Date().getTime() + 100000);
    const adjustedTime = new Date(
      dateInFuture.getTime() +
        (dateInFuture.getTimezoneOffset() - 240) * 60 * 1000,
    );

    expect(() =>
      createDuelHeat("test", {
        ...WPI_MV8_RESULTS,
        racedate: adjustedTime.toLocaleDateString(),
        racedatetime: adjustedTime.toLocaleString("en-US", {
          hour12: false,
        }),
        racedateUnix: adjustedTime.toLocaleDateString(),
        racetime: adjustedTime.toLocaleTimeString("en-US", { hour12: false }),
      }),
    ).toThrow("scheduled event with results");
  });

  describe("All class/gender combinations", () => {
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
            const displayName = `${gendersToDisplayGender[gender]} ${addOrdinal(
              parseIntOrUndefined(number) ?? 1,
            )} ${level === "V" ? "Varsity" : "Novice"} ${
              boatClassesToType[boatClass]
            }`;
            test(displayName, () => {
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
                  displayName,
                },
                scheduledStart: Date.parse(
                  `${EMPTY_ENTRY.racedatetime} GMT-0400`,
                ),
                status: "official",
                entries: [],
              } satisfies CreateEntityItem<
                typeof RegattaService.entities.heat
              >);
            });
          });
        });
      });

      highSchoolGenders.forEach((gender) => {
        highSchoolNumbers.forEach((number) => {
          const displayName = `${gendersToDisplayGender[gender]} ${number} ${boatClassesToType[boatClass]}`;
          test(displayName, () => {
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
                displayName,
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

  test("Entries with seed", () => {
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

  test("Entries with seed missing A", () => {
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
    const adjustedTime = new Date(
      startTimeInFuture.getTime() +
        (startTimeInFuture.getTimezoneOffset() - 240) * 60 * 1000,
    );

    expect(
      createDuelHeat("HCR", {
        ...HCR_WV8_SCHEDULED,
        racedate: adjustedTime.toLocaleDateString(),
        racetime: adjustedTime.toLocaleTimeString("en-US", { hour12: false }),
        racedateUnix: adjustedTime.toLocaleDateString(),
        racedatetime: adjustedTime.toLocaleString("en-US", { hour12: false }),
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

  test("Blank entry with time", () => {
    expect(createDuelHeat("vbnm", HCR_WV4_BLANK_TIME)).toEqual({
      regattaId: "vbnm",
      heatId: HCR_WV4_BLANK_TIME.id.toString(),
      type: {
        gender: "women",
        boatClass: "4+",
        displayName: "Women's 1st Varsity 4+",
      },
      scheduledStart: Date.parse(
        `${HCR_WV4_BLANK_TIME.racedatetime.toString()} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "University of Connecticut",
          bowNumber: 1,
          finishTime: 7 * 60 * 1000 + 54.5 * 1000,
        },
        {
          teamName: "Boston College",
          bowNumber: 2,
          finishTime: 7 * 60 * 1000 + 33.9 * 1000,
        },
        {
          teamName: "Unknown",
          bowNumber: 3,
          finishTime: 8 * 60 * 1000 + 17.64 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Blank entry", () => {
    expect(createDuelHeat("b", WPI_WV8_BLANK_ENTRY)).toEqual({
      regattaId: "b",
      heatId: WPI_WV8_BLANK_ENTRY.id.toString(),
      type: {
        gender: "women",
        boatClass: "8+",
        displayName: "Women's 1st Varsity 8+",
      },
      scheduledStart: Date.parse(
        `${WPI_WV8_BLANK_ENTRY.racedatetime.toString()} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "Bates",
          bowNumber: 1,
          finishTime: 6 * 60 * 1000 + 47.97 * 1000,
        },
        {
          teamName: "Hamilton",
          bowNumber: 2,
          finishTime: 6 * 60 * 1000 + 51.39 * 1000,
        },
        {
          teamName: "MHC",
          bowNumber: 3,
          finishTime: 7 * 60 * 1000 + 41.87 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("B seed not in entrydispseed", () => {
    expect(createDuelHeat("Bseed", WPI_WV4_B_SEED_NOT_IN_SEED)).toEqual({
      regattaId: "Bseed",
      heatId: WPI_WV4_B_SEED_NOT_IN_SEED.id.toString(),
      type: {
        gender: "women",
        boatClass: "4+",
        displayName: "Women's 1st Varsity 4+",
      },
      scheduledStart: Date.parse(
        `${WPI_WV4_B_SEED_NOT_IN_SEED.racedatetime} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "Connecticut College",
          bowNumber: 1,
          didFailToFinish: true,
        },
        {
          teamName: "WPI",
          bowNumber: 2,
          didFailToFinish: true,
        },
        {
          teamName: "Williams",
          bowNumber: 3,
          teamEntryLetter: "A",
          didFailToFinish: true,
        },
        {
          teamName: "Williams",
          bowNumber: 4,
          teamEntryLetter: "B",
          didFailToFinish: true,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Entry name whitespace trimmed", () => {
    expect(createDuelHeat("trimmed", WPI_WV4_WHITE_SPACE_ENTRY)).toEqual({
      regattaId: "trimmed",
      heatId: WPI_WV4_WHITE_SPACE_ENTRY.id.toString(),
      type: {
        gender: "women",
        boatClass: "4+",
        displayName: "Women's 1st Varsity 4+",
      },
      scheduledStart: Date.parse(
        `${WPI_WV4_WHITE_SPACE_ENTRY.racedatetime.toString()} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "Trinity",
          bowNumber: 1,
          teamEntryLetter: "1V",
          finishTime: 9 * 60 * 1000 + 22.42 * 1000,
        },
        {
          teamName: "WPI",
          bowNumber: 2,
          teamEntryLetter: "N4",
          didFailToFinish: true,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Finish time with hours", () => {
    expect(
      createDuelHeat("hours", {
        ...WPI_WV8_BLANK_ENTRY,
        entry1: "WPI",
        entrydisp1: "WPI",
        time1: "1:54:12.245",
        entry2: "",
        entrydisp2: "",
        time2: "",
        entry3: "",
        entrydisp3: "",
        time3: "",
      }),
    ).toEqual({
      heatId: WPI_WV8_BLANK_ENTRY.id.toString(),
      regattaId: "hours",
      type: {
        gender: "women",
        boatClass: "8+",
        displayName: "Women's 1st Varsity 8+",
      },
      scheduledStart: Date.parse(
        `${WPI_WV8_BLANK_ENTRY.racedatetime.toString()} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "WPI",
          bowNumber: 1,
          finishTime: 1 * 60 * 60 * 1000 + 54 * 60 * 1000 + 12.245 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("Finish time with no ms", () => {
    expect(
      createDuelHeat("MS", {
        ...WPI_WV8_BLANK_ENTRY,
        entry1: "",
        entrydisp1: "",
        time1: "",
        entry2: "Holy Cross",
        entrydisp2: "Holy Cross",
        time2: "6:45",
        entry3: "",
        entrydisp3: "",
        time3: "",
      }),
    ).toEqual({
      heatId: WPI_WV8_BLANK_ENTRY.id.toString(),
      regattaId: "MS",
      type: {
        gender: "women",
        boatClass: "8+",
        displayName: "Women's 1st Varsity 8+",
      },
      scheduledStart: Date.parse(
        `${WPI_WV8_BLANK_ENTRY.racedatetime.toString()} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "Holy Cross",
          bowNumber: 2,
          finishTime: 6 * 60 * 1000 + 45 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("3v/4v seed", () => {
    expect(createDuelHeat("asdf", WPI_M3V8_3V_4V_SEED)).toEqual({
      regattaId: "asdf",
      heatId: WPI_M3V8_3V_4V_SEED.id.toString(),
      type: {
        gender: "men",
        boatClass: "8+",
        displayName: "Men's 3rd Varsity 8+",
      },
      scheduledStart: Date.parse(
        `${WPI_M3V8_3V_4V_SEED.racedatetime.toString()} GMT-0400`,
      ),
      status: "official",
      entries: [
        {
          teamName: "Wesleyan",
          teamEntryLetter: "3V",
          bowNumber: 1,
          finishTime: 6 * 60 * 1000 + 25.72 * 1000,
        },
        {
          teamName: "WPI",
          teamEntryLetter: "3V",
          bowNumber: 2,
          finishTime: 6 * 60 * 1000 + 29.95 * 1000,
        },
        {
          teamName: "Wesleyan",
          teamEntryLetter: "4V",
          bowNumber: 3,
          finishTime: 6 * 60 * 1000 + 37.92 * 1000,
        },
        {
          teamName: "WPI",
          teamEntryLetter: "4V",
          bowNumber: 4,
          finishTime: 6 * 60 * 1000 + 36.42 * 1000,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });

  test("B seed only not in entrydispseed", () => {
    expect(
      createDuelHeat("seed", {
        ...EMPTY_ENTRY,
        event: "B1st8",
        racedate: "12/12/1996",
        racedateUnix: "1996-12-12",
        racetime: "11:00:00",
        racedatetime: "12/12/1996 11:00:00",
        entry5: "Colby C",
        entrydisp5: "Colby C",
        entryseed5: "",
      }),
    ).toEqual({
      heatId: EMPTY_ENTRY.id.toString(),
      regattaId: "seed",
      type: {
        gender: "men",
        boatClass: "8+",
        displayName: "Boy's 1st 8+",
      },
      scheduledStart: Date.parse(`12/12/1996 11:00:00 GMT-0400`),
      status: "scheduled",
      entries: [
        {
          teamName: "Colby",
          teamEntryLetter: "C",
          bowNumber: 5,
        },
      ],
    } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
  });
});
