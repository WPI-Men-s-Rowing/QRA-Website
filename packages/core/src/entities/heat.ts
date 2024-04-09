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
          type: ["8+", "4+", "4-", "4x", "3x", "2+", "2x", "2-", "1x"] as const,
        },
        gender: {
          required: true,
          type: ["men", "women", "open"] as const,
        },
        displayName: {
          required: true,
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
      type: [
        "scheduled",
        "delayed",
        "unofficial",
        "official",
        "in-progress",
      ] as const,
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
          // Finish time in MS. RAW IF THERE IS A PENALTY
          finishTime: {
            required: false,
            type: "number",
          },
          // Should be set to true if a crew fails to finish
          didFailToFinish: {
            required: false,
            type: "boolean",
          },
          // Details about a potential penalty
          penalty: {
            required: false,
            type: "map",
            properties: {
              // Type of the penalty
              type: {
                required: true,
                type: ["dsq", "time", "warning"] as const,
              },
              // Reason for the penalty
              reason: {
                required: true,
                type: "string",
              },
              // The time (added to finish time) for the penalty
              time: {
                required: false,
                type: "number",
              },
            },
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
    heatsByDate: {
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
