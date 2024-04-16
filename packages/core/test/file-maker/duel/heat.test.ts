import { describe, expect, test } from "vitest";
import { createDuelHeat } from "../../../src/file-maker/duel/heat.ts";
import { BREAK_HOST, WESLEYEAN_BREAK, WPI_BREAK } from "./examples/break.ts";
import {
  CLARK_WV8_GF,
  EMPTY_ENTRY,
  WPI_MV8_NO_ENTRIES,
  WPI_MV8_RESULTS,
} from "./examples/heat.ts";

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
});
