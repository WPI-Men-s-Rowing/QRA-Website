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
    },
    heatId: {
      type: "string",
      readOnly: true,
      default: () => ulid(),
    },
    type: {
      type: "map",
      properties: {
        boatClass: {
          type: "string",
        },
        gender: {
          type: "string",
        },
        displayName: {
          type: "string",
        },
      },
    },
    // Epoch MS
    scheduledStart: {
      type: "number",
    },
    // Delay in MS
    delay: {
      type: "number",
      required: false,
    },
    status: {
      type: ["scheduled", "delayed", "unofficial", "official"],
    },
    host: {
      // The host of the heat. For non-QRA regattas (e.g., duels) this should be the name of the host school
      type: "string",
      required: false,
    },
    // Progression information, optional. Should contain the number to the next heat, and the ID of the next heat
    progression: {
      type: "map",
      required: false,
      properties: {
        numberToNext: {
          type: "number",
        },
        nextId: {
          type: "string",
        },
      },
    },
    entries: {
      type: "list",
      items: {
        type: "map",
        properties: {
          // "foreign key" (even though this isn't enforced cuz NoSQL things) to team
          teamName: {
            type: "string",
          },
          // Entry letter for the team (e.g., "A", "B", "C"). Optional if the team only has one entry in the event
          teamEntryLetter: {
            type: "string",
            required: false,
          },
          bowNumber: {
            type: "number",
          },
          // Finish time in MS
          finishTime: {
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
                  type: "number",
                },
                // The time, in MS from race start
                time: {
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
  },
  databaseConfiguration,
});
