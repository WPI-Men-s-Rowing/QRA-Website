import { CreateEntityItem } from "electrodb";
import { describe, expect, test } from "vitest";
import { RegattaService } from "../../../src/dynamo-db/services.ts";
import { createDuelHeat } from "../../../src/file-maker/duel/heat.ts";
import { BREAK_HOST, WESLEYEAN_BREAK, WPI_BREAK } from "./examples/break.ts";
import {
  CLARK_WV8_GF,
  EMPTY_ENTRY,
  WPI_MV8_NO_ENTRIES,
  WPI_MV8_RESULTS,
} from "./examples/heat.ts";

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

  test("All event/gender combinations", () => {
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
                displayName: `${toFirstUppercase(
                  gendersToType[gender],
                )}'s ${addOrdinal(parseIntOrUndefined(number) ?? 1)} ${
                  level === "V" ? "Varsity" : "Novice"
                } ${boatClassesToType[boatClass]}`,
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
              displayName: `${toFirstUppercase(
                gendersToType[gender],
              )}'s ${number} ${boatClassesToType[boatClass]}`,
            },
            scheduledStart: Date.parse(`${EMPTY_ENTRY.racedatetime} GMT-0400`),
            status: "official",
            entries: [],
          } satisfies CreateEntityItem<typeof RegattaService.entities.heat>);
        });
      });
    });
  });
});
