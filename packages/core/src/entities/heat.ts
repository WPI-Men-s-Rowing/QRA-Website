import { Entity } from "electrodb";
import { ulid } from "ulid";
import { databaseConfiguration } from "../dynamo.ts";

/**
 * Entity representing a Heat in a regatta
 */
export const Heat = new Entity({
  model: {
    entity: "heat",
    version: "1",
    service: "regattas",
  },
  attributes: {
    // "foreign key" (even though the concept doesn't really exist in ElectroDB) to the regatta this is
    regattaId: {
      type: "string",
      readOnly: true,
      required: true,
    },
    heatId: {
      type: "string",
      readOnly: true,
      required: true,
      default: () => ulid(),
    },
    type: {
      type: "map",
      required: true,
      properties: {
        boatClass: {
          required: true,
          type: ["8+", "4+", "4-", "4x", "2+", "2-", "1x"] as const,
        },
        gender: {
          required: true,
          type: ["men", "women", "open"] as const,
        },
        displayName: {
          // Since a heat may contain some type information that can't be represented by only class and gender,
          // this enables that (this can be masters, 2v, etc.)
          required: false,
          type: "string",
        },
      },
    },
    // Epoch MS
    scheduledStart: {
      type: "number",
      required: true,
    },
    // Delay in MS
    delay: {
      type: "number",
      required: false,
    },
    status: {
      required: true,
      type: ["scheduled", "delayed", "unofficial", "official"] as const,
    },
    // Progression information, optional. Should contain the number to the next heat, and the ID of the next heat
    progression: {
      type: "map",
      required: false,
      properties: {
        numberToNext: {
          required: true,
          type: "number",
        },
        nextId: {
          required: true,
          type: "string",
        },
      },
    },
    entries: {
      required: true,
      type: "list",
      items: {
        type: "map",
        properties: {
          // "foreign key" (even though this isn't enforced cuz NoSQL things) to team
          teamName: {
            required: true,
            type: "string",
          },
          // Entry letter for the team (e.g., "A", "B", "C"). Optional if the team only has one entry in the event
          teamEntryLetter: {
            type: "string",
            required: false,
          },
          bowNumber: {
            required: true,
            type: "number",
          },
          // Finish time in MS
          finishTime: {
            required: false,
            type: "number",
          },
          segments: {
            // Optional (because this isn't always collected) distance/time pairs at intermediate points in the race
            type: "list",
            required: false,
            items: {
              type: "map",
              properties: {
                // The distance the time is represented at, in meters from start
                distance: {
                  required: true,
                  type: "number",
                },
                // The time, in MS from race start
                time: {
                  required: true,
                  type: "number",
                },
              },
            },
          },
        },
      },
    },
  },
  indexes: {
    // Enables querying everything about a regatta (e.g., summary info and heats)
    regatta: {
      collection: "regatta",
      pk: {
        field: "pk",
        composite: ["regattaId"],
      },
      sk: {
        field: "sk",
        composite: ["heatId"],
      },
    },
    heatsOnDate: {
      index: "gsi1",
      pk: {
        field: "gsi1pk",
        composite: [],
      },
      // Search by scheduled start. Includes regatta ID and heat ID to enforce uniqueness
      // (but you probably don't/won't query based on that)
      sk: {
        field: "gsi1sk",
        composite: ["scheduledStart", "regattaId", "heatId"],
      },
    },
  },
  databaseConfiguration,
});
