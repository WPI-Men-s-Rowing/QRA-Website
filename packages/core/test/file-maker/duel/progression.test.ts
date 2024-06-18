import { describe, expect, test } from "vitest";
import { createDuelHeat } from "../../../src/file-maker/duel/heat.ts";
import {
  HeatWithLanesEntry,
  processProgression,
} from "../../../src/file-maker/duel/progression.ts";
import { LakeScheduleLanesEntry } from "../../../src/file-maker/types/duel-types.ts";
import {
  ASSUMPTION_W3V8_DNF,
  EMPTY_ENTRY,
  HCR_WV8_SCHEDULED,
  WPI_MV4_SEED,
  WPI_MV8_NO_ENTRIES,
  WPI_MV8_RESULTS,
} from "./examples/heat.ts";
import {
  CLARK_W2V8_GF,
  CLARK_WV8_H_2,
  CLARK_WV8_PF,
  HOLY_CROSS_LANE_RACE,
  WPI_W2V8_GRAND_HOST,
  WPI_W2V8_HEAT_1,
  WPI_WV8_HEAT_HOST,
  WPI_WV8_PETITE_HOST,
} from "./examples/progression.ts";

/**
 * Converts a LakeScheduleLanesEntry object to a HeatWithLanesEntry object by adding the determined heat information
 * @param lanesEntry the lanes entry to create
 * @param regattaId the regatta ID to use in creating the heat
 * @returns the created HeatWithLanesEntry object
 */
function lanesEntryToHeatWithLanesEntry(
  lanesEntry: LakeScheduleLanesEntry,
  regattaId: string,
): HeatWithLanesEntry {
  return {
    lanesEntry,
    heat: createDuelHeat(regattaId, lanesEntry),
  };
}

/**
 * Map relating lanes entries to heats with their associated lanes entries
 * @param lanesEntries the lanes entries to convert to heats with lanes entries
 * @param regattaId the regatta ID to use in creating the heat
 * @returns the lanes entries with their heats in an array
 */
function lanesEntriesToHeatsWithLanesEntries(
  lanesEntries: readonly LakeScheduleLanesEntry[],
  regattaId: string,
): HeatWithLanesEntry[] {
  return lanesEntries.map((lanesEntry) =>
    lanesEntryToHeatWithLanesEntry(lanesEntry, regattaId),
  );
}

describe("processProgression", () => {
  test("No progression causes no changes", () => {
    const regattaEntries: HeatWithLanesEntry[] =
      lanesEntriesToHeatsWithLanesEntries(
        [WPI_MV4_SEED, WPI_MV8_RESULTS],
        "test",
      );
    const expected = structuredClone(regattaEntries);
    processProgression(regattaEntries);
    expect(regattaEntries).toStrictEqual(expected);
  });

  test("Scheduled no progression causes no changes", () => {
    const dateInFuture = new Date(Date.now() + 1234567);
    const futureEntry: LakeScheduleLanesEntry = {
      ...HCR_WV8_SCHEDULED,
      racedate: dateInFuture.toDateString(),
      racedateUnix: dateInFuture.toDateString(),
      racetime: dateInFuture.toTimeString(),
      racedatetime: dateInFuture.toString(),
    };

    const regattaEntries: HeatWithLanesEntry[] =
      lanesEntriesToHeatsWithLanesEntries([futureEntry], "scheduled");
    const expected = structuredClone(regattaEntries);
    processProgression(regattaEntries);
    expect(regattaEntries).toStrictEqual(expected);
  });

  test("Missing heats for final throws", () => {
    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries([CLARK_W2V8_GF], "missing"),
      ),
    ).toThrow("Found a final with no matching heats");
    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries([CLARK_WV8_PF], "missing"),
      ),
    ).toThrow("Found a final with no matching heats");

    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries(
          [WPI_W2V8_GRAND_HOST],
          "final_missing",
        ),
      ),
    ).toThrow("Found a final with no matching heats");

    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries(
          [WPI_WV8_PETITE_HOST],
          "final_missing",
        ),
      ),
    ).toThrow("Found a final with no matching heats");
  });

  test("Missing final for heat throws", () => {
    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries([WPI_W2V8_HEAT_1], "final_missing"),
      ),
    ).toThrow("Found a heat with no matching finals");

    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries([CLARK_WV8_H_2], "final_missing"),
      ),
    ).toThrow("Found a heat with no matching finals");

    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries(
          [WPI_WV8_HEAT_HOST],
          "final_missing",
        ),
      ),
    ).toThrow("Found a heat with no matching finals");
  });

  test("No heats for finals throws", () => {
    expect(() =>
      processProgression(
        lanesEntriesToHeatsWithLanesEntries(
          [
            {
              ...WPI_WV8_PETITE_HOST,
              host: "WPI GRAND",
            },

            WPI_WV8_PETITE_HOST,
          ],
          "asdf",
        ),
      ),
    ).toThrow("Found 2 finals and 0 heats");
  });

  test("Multiple nondescript events of the same type throws", () => {
    expect(() => {
      processProgression(
        lanesEntriesToHeatsWithLanesEntries(
          [WPI_MV8_RESULTS, WPI_MV8_NO_ENTRIES, WPI_MV8_RESULTS],
          "nondescript",
        ),
      );
    }).toThrow("Found 3 finals and 0 heats");
  });

  test("Multiple heats with no finals throws", () => {
    expect(() => {
      processProgression(
        lanesEntriesToHeatsWithLanesEntries(
          [
            WPI_WV8_HEAT_HOST,
            WPI_WV8_HEAT_HOST,
            WPI_WV8_HEAT_HOST,
            WPI_WV8_HEAT_HOST,
          ],
          "heats",
        ),
      );
    }).toThrow("Found 4 heats and 0 finals");
  });

  test("Progressed with no finish time throws", () => {
    const event = lanesEntriesToHeatsWithLanesEntries(
      [
        { ...ASSUMPTION_W3V8_DNF },
        {
          ...ASSUMPTION_W3V8_DNF,
          id: ASSUMPTION_W3V8_DNF.id + 1,
          racetime: "12:30:00",
          racedatetime: "04/22/2023 12:30:00",
          time4: "8:25.55",
        },
      ],
      "no_finish",
    );
    const reversedClone = structuredClone(event).reverse();

    expect(() => processProgression(event)).toThrow(
      "that progressed with no finish time",
    );
    expect(() => processProgression(reversedClone)).toThrow(
      "that progressed with no finish time",
    );
  });

  test("Lane race progression info", () => {
    const laneRace = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...HOLY_CROSS_LANE_RACE[0],
          time1: "06:37.450",
          time2: "06:45.999",
          time3: "06:30.555",
        },
        { ...HOLY_CROSS_LANE_RACE[1], time1: "06:06.444", time2: "06:08.999" },
      ],
      "lane",
    );
    const reversedLaneRace = structuredClone(laneRace).reverse();

    const expected = structuredClone(laneRace);

    expected[0].heat.progression = {
      next: [{ id: expected[1].heat.heatId }],
      description: "Heat",
    };
    expected[1].heat.progression = {
      description: "Final",
      previous: {
        entries: [
          {
            sourceIds: [expected[0].heat.heatId],
            bowNumber: 1,
            startPosition: 0,
          },
          {
            sourceIds: [expected[0].heat.heatId],
            bowNumber: 2,
            startPosition: 0,
          },
        ],
      },
    };
    expected[1].heat.entries[0].teamName = "Colgate";
    expected[1].heat.entries[1].teamName = "Holy Cross";

    processProgression(laneRace);
    processProgression(reversedLaneRace);

    expect(laneRace).toStrictEqual(expected);
    expect(reversedLaneRace).toStrictEqual(expected.reverse());
  });

  test("Lane race rebuild progression", () => {
    const laneRace = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...HOLY_CROSS_LANE_RACE[0],
          entry1: "Holy Cross",
          entry2: "WPI",
          entry3: "Clark",
          time1: "08:39.951",
          time2: "08:00.001",
          time3: "07:55.505",
        },
        {
          ...HOLY_CROSS_LANE_RACE[1],
          entry1: "Clark",
          entry2: "WPI",
          entry3: "Holy Cross",
          time1: "07:06.444",
          time2: "07:08.999",
          time3: "07:10.999",
        },
      ],
      "lane",
    );
    const reversedLaneRace = structuredClone(laneRace).reverse();

    const expected = structuredClone(laneRace);

    expected[0].heat.progression = {
      next: [{ id: expected[1].heat.heatId }],
      description: "Heat",
    };
    expected[1].heat.progression = {
      description: "Final",
      previous: {
        entries: [
          {
            sourceIds: [expected[0].heat.heatId],
            bowNumber: 1,
            startPosition: 0,
          },
          {
            sourceIds: [expected[0].heat.heatId],
            bowNumber: 2,
            startPosition: 0,
          },
          {
            sourceIds: [expected[0].heat.heatId],
            bowNumber: 3,
            startPosition: 0,
          },
        ],
      },
    };

    processProgression(laneRace);
    processProgression(reversedLaneRace);

    expect(laneRace).toStrictEqual(expected);
    expect(reversedLaneRace).toStrictEqual(expected.reverse());
  });

  test("One final progression info", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "WPI";
    expected[2].heat.entries[1].teamName = "Coast Guard";
    expected[2].heat.entries[2].teamName = "Wesleyan";
    expected[2].heat.entries[3].teamName = "Tufts";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Duplicate heat number throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 5,
          event: "MV8 H2",
          entry1: "Middleburry",
          time1: "08:08.000",
          entry2: "Wisconsin",
          time2: "08:50.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
      ],
      "dup_heat",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate heat");
    expect(processProgression(raceReversed)).toThrow("duplicate heat");
  });

  test("Duplicate final throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 GF",
          entry1: "3rd H1",
          time1: "08:00.0",
          entry2: "3rd H2",
          time2: "09:00.0",
        },
      ],
      "dup_final",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate final");
    expect(processProgression(raceReversed)).toThrow("duplicate final");
  });

  test("Duplicate progression entry same final throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 1",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
      ],
      "dup_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate progression entry");
    expect(processProgression(raceReversed)).toThrow(
      "duplicate progression entry",
    );
  });

  test("Duplicate progression entry different final throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 1",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 PF",
          entry5: "1st H1",
        },
      ],
      "dup_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate progression entry");
    expect(processProgression(raceReversed)).toThrow(
      "duplicate progression entry",
    );
  });

  test("Missing heat throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV4 H1",
          entry1: "Wesleyan",
          time1: "06:00.000",
          entry2: "Williams",
          time2: "06:01.020",
          entry3: "Coast Guard",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV4 H2",
          entry1: "WPI",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Skidmore",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV4 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 1",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
          entry6: "1st h9",
        },
      ],
      "missing_heat",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("missing heat");
    expect(processProgression(raceReversed)).toThrow("missing heat");
  });

  test("Progression with no match throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "WV8",
          host: "WPI HEAT",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "WV8",
          host: "WPI HEAT",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "WV8",
          host: "WPI GRAND",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 1",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
          entry6: "9th h1",
        },
      ],
      "no_match",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("failed to find a match for");
    expect(processProgression(raceReversed)).toThrow(
      "failed to find a match for",
    );
  });

  test("Missing entry progressed throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "Skidmore",
          time1: "06:06.000",
          entry2: "Tufts",
          time2: "06:07.000",
          entry3: "Coast Guard",
          time3: "06:08.000",
          entry4: "Wesleyan",
          time4: "06:00.000",
        },
      ],
      "missing_heat",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("failed to find a match for");
    expect(processProgression(raceReversed)).toThrow(
      "failed to find a match for",
    );
  });

  test("Duplicate entry across heats with no seed throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "WPI",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 1",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
      ],
      "missing_heat",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate entry");
    expect(processProgression(raceReversed)).toThrow("duplicate entry");
  });

  test("Duplicate entry across heats with seed throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8",
          host: "CLARK HEAT",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates A",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8",
          host: "CLARK HEAT",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
          entry3: "Bates A",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8",
          host: "CLARK PETITE",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 1",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
      ],
      "missing_heat",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate entry");
    expect(processProgression(raceReversed)).toThrow("duplicate entry");
  });

  test("No heat numbers provided", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8",
          host: "WPI GRAND",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Wesleyan";
    expected[2].heat.entries[1].teamName = "Tufts";
    expected[2].heat.entries[2].teamName = "Bates";
    expected[2].heat.entries[3].teamName = "Coast Guard";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Progression info with seed", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "WV4 heat1",
          entry1: "Vassar",
          entryseed1: "A",
          time1: "07:00.000",
          entry2: "Williams",
          entryseed2: "A",
          time2: "06:01.020",
          entry3: "Vassar",
          entryseed3: "B",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "WV4 H2",
          entry1: "Williams",
          entryseed1: "B",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "WV4 GF",
          entry1: "3rd heat2",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "3rd h 1",
          time3: "06:08.000",
          entry4: "1st HEAT2",
          time4: "06:00.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Vassar";
    expected[2].heat.entries[0].teamEntryLetter = "A";
    expected[2].heat.entries[1].teamName = "Williams";
    expected[2].heat.entries[1].teamEntryLetter = "A";
    expected[2].heat.entries[2].teamName = "Williams";
    expected[2].heat.entries[2].teamEntryLetter = "B";
    expected[2].heat.entries[3].teamName = "Tufts";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("One final with fastest", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
          entry5: "1st Fastest",
          time5: "05:00.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 5,
            sourceIds: [expected[0].heat.heatId, expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Wesleyan";
    expected[2].heat.entries[1].teamName = "Tufts";
    expected[2].heat.entries[2].teamName = "Bates";
    expected[2].heat.entries[3].teamName = "Coast Guard";
    expected[2].heat.entries[4].teamName = "WPI";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("One final rebuild progression", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "Wesleyan",
          time1: "06:06.000",
          entry2: "Bates",
          time2: "06:07.000",
          entry3: "Tufts",
          time3: "06:08.000",
          entry4: "Coast Guard",
          time4: "06:00.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Wesleyan";
    expected[2].heat.entries[1].teamName = "Tufts";
    expected[2].heat.entries[2].teamName = "Bates";
    expected[2].heat.entries[3].teamName = "Coast Guard";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Rebuild progression with seed", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "WV8",
          host: "Clark HEAT",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Tufts",
          time2: "06:01.020",
          entry3: "Wesleyan",
          time3: "06:06.050",
          entryseed3: "B",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "WV8",
          host: "Clark HEAT",
          entry1: "Wesleyan",
          entrydisp1: "A",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "WV8 GF",
          entry1: "Wesleyan",
          entryseed1: "B",
          time1: "06:06.000",
          entry2: "WPI",
          time2: "06:07.000",
          entry3: "Tufts",
          time3: "06:08.000",
          entry4: "Coast Guard",
          time4: "06:00.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 1,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Wesleyan";
    expected[2].heat.entries[1].teamName = "Tufts";
    expected[2].heat.entries[2].teamName = "Bates";
    expected[2].heat.entries[3].teamName = "Coast Guard";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Two finals progression info", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 heat1",
          host: "WPI",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          host: "WPI",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 PF",
          entry1: "3rd HEAT1",
          time1: "07:07.000",
          entry2: "3rd h2",
          time2: "08:08.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }, { id: expected[3].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }, { id: expected[3].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Wesleyan";
    expected[2].heat.entries[1].teamName = "Tufts";
    expected[2].heat.entries[2].teamName = "Bates";
    expected[2].heat.entries[3].teamName = "Coast Guard";
    expected[3].heat.progression = {
      description: "Petite Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 2,
          },
        ],
      },
    };

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Non-trivial duplicate entries throws", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 heat1",
          host: "WPI",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          host: "WPI",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st heat 2",
          time2: "06:07.000",
          entry3: "2nd h 1",
          time3: "06:08.000",
          entry4: "2nd HEAT2",
          time4: "06:00.000",
          entry5: "1st Fastest",
          time5: "07:00.0",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 PF",
          entry1: "3rd HEAT1",
          time1: "07:07.000",
          entry2: "3rd h2",
          time2: "08:08.000",
        },
      ],
      "final_prog",
    );
    const raceReversed = structuredClone(race).reverse();

    expect(processProgression(race)).toThrow("duplicate entry");
    expect(processProgression(raceReversed)).toThrow("duplicate entry");
  });

  test("Two finals rebuild progression", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "WPI",
          time1: "07:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
          entry3: "Bates",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8",
          host: "WPI HEAT",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "06:00.000",
          entry3: "Coast Guard",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 PF",
          entry1: "WPI",
          time1: "06:55.000",
          entry2: "Williams",
          time2: "07:05.000",
          entry3: "Bates",
          time3: "07:01.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 GF",
          entry1: "Wesleyan",
          time1: "06:06.000",
          entry2: "Tufts",
          time2: "06:07.000",
          entry3: "Coast Guard",
          time3: "06:08.000",
        },
      ],
      "final_prog",
    );

    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }, { id: expected[3].heat.heatId }],
    };

    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }, { id: expected[3].heat.heatId }],
    };

    expected[3].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };

    expected[2].heat.entries[0].teamName = "WPI";
    expected[2].heat.entries[1].teamName = "Williams";
    expected[2].heat.entries[2].teamName = "Bates";
    expected[3].heat.entries[0].teamName = "Wesleyan";
    expected[3].heat.entries[1].teamName = "Tufts";
    expected[3].heat.entries[2].teamName = "Coast Guard";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Progression with no finish data", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "WPI",
          time1: "06:00.000",
          entry2: "Wesleyan",
          time2: "06:01.020",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Williams",
          time1: "07:07.000",
          entry2: "Tufts",
          time2: "07:00.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 PF",
          entry1: "2nd H1",
          time1: "06:50.000",
          entry2: "2nd H2",
          time2: "06:55.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 GF",
          entry1: "1st H1",
          time1: "06:06.000",
          entry2: "1st H2",
          time2: "06:07.000",
        },
      ],
      "final_prog",
    );

    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[3].heat.heatId }, { id: expected[2].heat.heatId }],
    };

    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[3].heat.heatId }, { id: expected[2].heat.heatId }],
    };

    expected[2].heat.progression = {
      description: "Petite Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 1,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 1,
          },
        ],
      },
    };

    expected[3].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };

    expected[2].heat.entries[0].teamName = "WPI";
    expected[2].heat.entries[1].teamName = "Tufts";
    expected[3].heat.entries[0].teamName = "Wesleyan";
    expected[3].heat.entries[1].teamName = "Williams";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Multiple events one final each", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "Harvard",
          time1: "06:00.000",
          entry2: "Yale",
          time2: "06:01.020",
          entry3: "Princeton",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Brown",
          time1: "07:07.000",
          entry2: "Cornell",
          time2: "07:00.000",
          entry3: "Dartmouth",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 GF",
          entry1: "Harvard",
          time1: "06:06.000",
          entry2: "Brown",
          time2: "06:07.000",
          entry3: "Yale",
          time3: "06:08.000",
          entry4: "Cornell",
          time4: "06:00.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "WV8 H1",
          entry1: "Stanford",
          time1: "06:10.000",
          entry2: "Cal",
          time2: "06:11.020",
          entry3: "UCLA",
          time3: "06:16.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 5,
          event: "WV8 H2",
          entry1: "USC",
          time1: "07:17.000",
          entry2: "Oregon State",
          time2: "07:10.000",
          entry3: "Washington",
          time3: "06:55.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 6,
          event: "WV8 GF",
          entry1: "Stanford",
          time1: "06:16.000",
          entry2: "USC",
          time2: "06:17.000",
          entry3: "Cal",
          time3: "06:18.000",
          entry4: "Oregon State",
          time4: "06:10.000",
        },
      ],
      "final_prog",
    );

    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[2].heat.heatId }],
    };
    expected[2].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[2].heat.entries[0].teamName = "Harvard";
    expected[2].heat.entries[1].teamName = "Brown";
    expected[2].heat.entries[2].teamName = "Yale";
    expected[2].heat.entries[3].teamName = "Cornell";

    expected[3].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[5].heat.heatId }],
    };
    expected[4].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[5].heat.heatId }],
    };
    expected[5].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[3].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[4].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[3].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[4].heat.heatId],
            startPosition: 0,
          },
        ],
      },
    };
    expected[5].heat.entries[0].teamName = "Stanford";
    expected[5].heat.entries[1].teamName = "USC";
    expected[5].heat.entries[2].teamName = "Cal";
    expected[5].heat.entries[3].teamName = "Oregon State";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });

  test("Multiple events multiple finals", () => {
    const race = lanesEntriesToHeatsWithLanesEntries(
      [
        {
          ...EMPTY_ENTRY,
          id: 1,
          event: "MV8 H1",
          entry1: "Harvard",
          time1: "06:00.000",
          entry2: "Yale",
          time2: "06:01.020",
          entry3: "Princeton",
          time3: "06:06.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 2,
          event: "MV8 H2",
          entry1: "Brown",
          time1: "07:07.000",
          entry2: "Cornell",
          time2: "07:00.000",
          entry3: "Dartmouth",
          time3: "06:45.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 3,
          event: "MV8 PF",
          entry1: "Princeton",
          time1: "06:50.000",
          entry2: "Dartmouth",
          time2: "06:55.000",
          entry3: "Yale",
          time3: "07:05.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 4,
          event: "MV8 GF",
          entry1: "Harvard",
          time1: "06:06.000",
          entry2: "Brown",
          time2: "06:07.000",
          entry3: "Cornell",
          time3: "06:08.000",
          entry4: "Yale",
          time4: "06:00.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 5,
          event: "WV8 H1",
          entry1: "Stanford",
          time1: "06:10.000",
          entry2: "Cal",
          time2: "06:11.020",
          entry3: "UCLA",
          time3: "06:16.050",
        },
        {
          ...EMPTY_ENTRY,
          id: 6,
          event: "WV8 H2",
          entry1: "USC",
          time1: "07:17.000",
          entry2: "Oregon State",
          time2: "07:10.000",
          entry3: "Washington",
          time3: "06:55.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 7,
          event: "WV8 PF",
          entry1: "UCLA",
          time1: "06:50.000",
          entry2: "Washington",
          time2: "06:55.000",
          entry3: "Cal",
          time3: "07:05.000",
        },
        {
          ...EMPTY_ENTRY,
          id: 8,
          event: "WV8 GF",
          entry1: "Stanford",
          time1: "06:16.000",
          entry2: "USC",
          time2: "06:17.000",
          entry3: "Oregon State",
          time3: "06:18.000",
          entry4: "Cal",
          time4: "06:10.000",
        },
      ],
      "final_prog",
    );

    const raceReversed = structuredClone(race).reverse();

    const expected = structuredClone(race);

    expected[0].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[3].heat.heatId }, { id: expected[2].heat.heatId }],
    };
    expected[1].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[3].heat.heatId }, { id: expected[2].heat.heatId }],
    };

    expected[2].heat.progression = {
      description: "Petite Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 1,
          },
        ],
      },
    };

    expected[3].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[1].heat.heatId],
            startPosition: 1,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[0].heat.heatId],
            startPosition: 1,
          },
        ],
      },
    };

    expected[2].heat.entries[0].teamName = "Princeton";
    expected[2].heat.entries[1].teamName = "Dartmouth";
    expected[2].heat.entries[2].teamName = "Yale";
    expected[3].heat.entries[0].teamName = "Harvard";
    expected[3].heat.entries[1].teamName = "Brown";
    expected[3].heat.entries[2].teamName = "Cornell";
    expected[3].heat.entries[3].teamName = "Yale";

    expected[4].heat.progression = {
      description: "Heat 1",
      next: [{ id: expected[7].heat.heatId }, { id: expected[6].heat.heatId }],
    };
    expected[5].heat.progression = {
      description: "Heat 2",
      next: [{ id: expected[7].heat.heatId }, { id: expected[6].heat.heatId }],
    };

    expected[6].heat.progression = {
      description: "Petite Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[4].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[5].heat.heatId],
            startPosition: 2,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[4].heat.heatId],
            startPosition: 1,
          },
        ],
      },
    };

    expected[7].heat.progression = {
      description: "Grand Final",
      previous: {
        entries: [
          {
            bowNumber: 1,
            sourceIds: [expected[4].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 2,
            sourceIds: [expected[5].heat.heatId],
            startPosition: 0,
          },
          {
            bowNumber: 3,
            sourceIds: [expected[5].heat.heatId],
            startPosition: 1,
          },
          {
            bowNumber: 4,
            sourceIds: [expected[4].heat.heatId],
            startPosition: 1,
          },
        ],
      },
    };

    expected[6].heat.entries[0].teamName = "UCLA";
    expected[6].heat.entries[1].teamName = "Washington";
    expected[6].heat.entries[2].teamName = "Cal";
    expected[7].heat.entries[0].teamName = "Stanford";
    expected[7].heat.entries[1].teamName = "USC";
    expected[7].heat.entries[2].teamName = "Oregon State";
    expected[7].heat.entries[3].teamName = "Cal";

    processProgression(race);
    processProgression(raceReversed);

    expect(race).toStrictEqual(expected);
    expect(raceReversed).toStrictEqual(expected.reverse());
  });
});
