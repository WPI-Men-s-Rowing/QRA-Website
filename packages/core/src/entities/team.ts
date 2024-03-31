import { Entity } from "electrodb";
import { databaseConfiguration } from "../dynamo.ts";

/**
 * Entity representing a Team
 */
export const Team = new Entity(
  {
    model: {
      entity: "team",
      version: "1",
      service: "teams",
    },
    attributes: {
      name: {
        required: true,
        type: "string",
      },
    },
    indexes: {
      // Index to enable querying all teams (or a team by their name if SK is provided)
      team: {
        pk: {
          field: "pk",
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["name"],
        },
      },
    },
  },
  databaseConfiguration,
);
