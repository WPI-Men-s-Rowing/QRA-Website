import { CreateEntityItem } from "electrodb";
import { describe, expect, test } from "vitest";
import { RegattaService } from "../../../src/dynamo-db/services.ts";
import {
  createDuelRegattaBreak as createDuelBreak,
  isDuelBreak,
} from "../../../src/file-maker/duels/break.ts";
import { BREAK_HOST, WESLEYEAN_BREAK, WPI_BREAK } from "./examples/break.ts";
import {
  CLARK_WV8_GF,
  EMPTY_ENTRY,
  WPI_MV8_NO_ENTRIES,
  WPI_MV8_RESULTS,
} from "./examples/heat.ts";

describe("isDuelBreak", () => {
  test("Not Break", () => {
    expect(isDuelBreak(CLARK_WV8_GF)).toBe(false);
    expect(isDuelBreak(WPI_MV8_RESULTS)).toBe(false);
  });

  test("Empty Event", () => {
    expect(isDuelBreak(EMPTY_ENTRY)).toBe(false);
    expect(isDuelBreak(WPI_MV8_NO_ENTRIES)).toBe(false);
  });

  test("Break in Host", () => {
    expect(isDuelBreak(BREAK_HOST)).toBe(true);
    expect(
      isDuelBreak({ ...BREAK_HOST, lk_schd_id: 123456, id: 1233456 }),
    ).toBe(true);
  });

  test("Break in Entry", () => {
    expect(isDuelBreak(WESLEYEAN_BREAK)).toBe(true);
    expect(isDuelBreak(WPI_BREAK)).toBe(true);
  });
});

describe("createDuelRegattaBreak", () => {
  test("Not Break", () => {
    expect(() => createDuelBreak("", CLARK_WV8_GF)).toThrow();
    expect(() => createDuelBreak("12345", WPI_MV8_NO_ENTRIES)).toThrow();
  });

  test("Complete Break", () => {
    expect(createDuelBreak("123", WPI_BREAK)).toStrictEqual({
      breakId: WPI_BREAK.id.toString(),
      regattaId: "123",
      scheduledStart: Date.parse(`${WPI_BREAK.racedatetime} GMT-0400`),
      status: "complete",
    } satisfies CreateEntityItem<typeof RegattaService.entities.break>);

    expect(createDuelBreak("1", WESLEYEAN_BREAK)).toStrictEqual({
      breakId: WESLEYEAN_BREAK.id.toString(),
      regattaId: "1",
      scheduledStart: Date.parse(`${WESLEYEAN_BREAK.racedatetime} GMT-0400`),
      status: "complete",
    } satisfies CreateEntityItem<typeof RegattaService.entities.break>);
  });

  test("Complete Break in Host", () => {
    expect(createDuelBreak("456", BREAK_HOST)).toStrictEqual({
      breakId: BREAK_HOST.id.toString(),
      regattaId: "456",
      scheduledStart: Date.parse(`${BREAK_HOST.racedatetime} GMT-0400`),
      status: "complete",
    } satisfies CreateEntityItem<typeof RegattaService.entities.break>);
  });

  test("Scheduled Break", () => {
    const dateTime = new Date(new Date().getTime() + 100000);
    expect(
      createDuelBreak("999", {
        ...WESLEYEAN_BREAK, // Fill the random stuff
        event: "Break",
        host: "Wesleyean",
        id: 123,
        racedate: dateTime.toDateString(),
        racetime: dateTime.toTimeString(),
        racedatetime: dateTime.toString(),
      }),
    ).toStrictEqual({
      regattaId: "999",
      breakId: "123",
      scheduledStart: Date.parse(dateTime.toString()), // Some rounding occurs, so let that happen
      status: "scheduled",
    } satisfies CreateEntityItem<typeof RegattaService.entities.break>);
  });

  test("Scheduled Break in Host", () => {
    const dateTime = new Date(new Date().getTime() + 9000);
    expect(
      createDuelBreak("897897", {
        ...WESLEYEAN_BREAK, // Fill the random stuff
        id: 91234,
        event: "",
        host: "Break",
        racedate: dateTime.toDateString(),
        racetime: dateTime.toTimeString(),
        racedatetime: dateTime.toString(),
      }),
    ).toStrictEqual({
      regattaId: "897897",
      breakId: "91234",
      scheduledStart: Date.parse(dateTime.toString()), // Some rounding occurs, so let that happen
      status: "scheduled",
    } satisfies CreateEntityItem<typeof RegattaService.entities.break>);
  });
});
