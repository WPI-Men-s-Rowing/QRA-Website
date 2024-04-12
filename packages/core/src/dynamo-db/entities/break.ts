import { Entity } from "electrodb";
import { ulid } from "ulid";
import { databaseConfiguration } from "../dynamo.ts";

export const Break = new Entity({
  model: {
    entity: "break",
    version: "1",
    service: "regattas",
  },
  attributes: {
    // ID of the regatta this break belongs to
    regattaId: {
      required: true,
      type: "string",
      readOnly: true,
    },
    breakId: {
      required: true,
      type: "string",
      readOnly: true,
      default: () => ulid(),
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
      type: ["scheduled", "delayed", "complete", "in-progress"] as const,
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
        composite: ["breakId"],
      },
    },
  },
  databaseConfiguration,
});
