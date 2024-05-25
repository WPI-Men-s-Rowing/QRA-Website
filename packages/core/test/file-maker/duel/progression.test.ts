import { describe, expect, test } from "vitest";
import { createDuelHeat } from "../../../src/file-maker/duel/heat.ts";
import {
  HeatWithLanesEntry,
  processProgression,
} from "../../../src/file-maker/duel/progression.ts";
import { LakeScheduleLanesEntry } from "../../../src/file-maker/types/duel-types.ts";
import {
  ASSUMPTION_W3V8_DNF,
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
        { ...HOLY_CROSS_LANE_RACE[1] },
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
});
