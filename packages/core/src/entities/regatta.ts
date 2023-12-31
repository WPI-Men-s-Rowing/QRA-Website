import { Entity } from "electrodb";
import { ulid } from "ulid";
import { databaseConfiguration } from "../dynamo.ts";

/**
 * Entity representing summary data about a regatta
 */
export const Regatta = new Entity({
  model: {
    entity: "regatta",
    version: "1",
    service: "regattas",
  },
  attributes: {
    regattaId: {
      type: "string",
      readOnly: true,
      required: true,
      default: () => ulid(),
    },
    name: {
      required: true,
      type: "string",
    },
    type: {
      required: true,
      type: ["duel", "head", "championship"] as const,
    },
    distance: {
      required: true,
      type: "number",
    },
    startDate: {
      required: true,
      type: "number",
    },
    endDate: {
      required: true,
      type: "number",
    },
  },
  indexes: {
    regatta: {
      // Index to query information about the regatta, including all heats. The heat will use the same PK with an SK of their heat ID
      collection: "regatta",
      pk: {
        field: "pk",
        composite: ["regattaId"],
      },
      sk: {
        field: "sk",
        composite: [],
      },
    },
    regattaSummary: {
      // Index to query all regattas summary information. Used to create a "summary page"
      // The SK contains date info to enable you to query all regattas around a certain date. It must also contain the ID
      // to enforce uniqueness. However, the ID is last because if you know the ID already you can just use the other index
      index: "gsi1",
      pk: {
        field: "gsi1pk",
        composite: [],
      },
      sk: {
        field: "gsi1sk",
        composite: ["startDate", "endDate", "regattaId"],
      },
    },
  },
  databaseConfiguration,
});
