import { CreateEntityItem } from "electrodb";
import { describe, expect, test } from "vitest";
import { RegattaService } from "../../../src/dynamo-db/services.ts";
import {
  createDuelRegatta,
  isDuelRegatta,
} from "../../../src/file-maker/duel/regatta.ts";
import {
  NERC_PRACTICE,
  SNAKE,
  WORCESTER_ACADEMY_DUEL,
  WORMTOWN_CHASE,
  WPI_MEN_DUEL,
  WPI_WOMEN_DUEL,
} from "./examples/regatta.ts";

describe("isDuelRegatta", () => {
  test("Championship regatta", () => {
    expect(isDuelRegatta(NERC_PRACTICE)).toBe(false);
  });

  test("High school duel", () => {
    expect(isDuelRegatta(WORCESTER_ACADEMY_DUEL)).toBe(true);
  });

  test("Collegiate duel", () => {
    expect(isDuelRegatta(WPI_MEN_DUEL)).toBe(true);
    expect(isDuelRegatta(WPI_WOMEN_DUEL)).toBe(true);
  });

  test("Head race", () => {
    expect(isDuelRegatta(SNAKE)).toBe(false);
    expect(isDuelRegatta(WORMTOWN_CHASE)).toBe(false);
  });

  test("Collegiate non-sprint", () => {
    expect(
      isDuelRegatta({
        ...SNAKE,
        clubtype: "Col",
      }),
    ).toBe(false);
  });

  test("High school non-sprint", () => {
    expect(
      isDuelRegatta({
        ...WORMTOWN_CHASE,
        clubtype: "HS",
        regattatype: "Head",
      }),
    ).toBe(false);
  });
});

describe("createDuelRegatta", () => {
  test("Non-duel regatta throws", () => {
    expect(() => createDuelRegatta(SNAKE)).toThrow("is not a valid duel");
  });

  test("Blank race name", () => {
    expect(createDuelRegatta(WORCESTER_ACADEMY_DUEL)).toStrictEqual({
      regattaId: WORCESTER_ACADEMY_DUEL.id.toString(),
      name: `${WORCESTER_ACADEMY_DUEL.localschool} Duel`,
      type: "duel",
      host: WORCESTER_ACADEMY_DUEL.localschool,
      participantDescription: WORCESTER_ACADEMY_DUEL.competitors,
      startDate: Date.parse(
        `${WORCESTER_ACADEMY_DUEL.racedate} ${WORCESTER_ACADEMY_DUEL.timeStart} GMT-0400`,
      ),
      endDate: Date.parse(
        `${WORCESTER_ACADEMY_DUEL.racedateEnd} ${WORCESTER_ACADEMY_DUEL.timeEnd} GMT-0400`,
      ),
      rampClosed: false,
      distance: 2000,
    } satisfies CreateEntityItem<typeof RegattaService.entities.regatta>);
  });

  test("Class of 2003 Cup", () => {
    expect(createDuelRegatta(WPI_MEN_DUEL)).toStrictEqual({
      regattaId: WPI_MEN_DUEL.id.toString(),
      name: "Class of 2003 Cup",
      type: "duel",
      host: "WPI",
      participantDescription: "Colby, Hamilton, Wesleyan",
      rampClosed: false,
      distance: 2000,
      startDate: Date.parse(`04/06/2024 08:30:00 GMT-0400`),
      endDate: Date.parse(`04/06/2024 10:10:00 GMT-0400`),
    } satisfies CreateEntityItem<typeof RegattaService.entities.regatta>);
  });
});
