import { Service } from "electrodb";
import { databaseConfiguration } from "./dynamo.ts";
import { Heat } from "./entities/heat.ts";
import { Regatta } from "./entities/regatta.ts";
import { Team } from "./entities/team.ts";

/**
 * Service for teams
 */
export const TeamService = new Service(
  {
    team: Team,
  },
  databaseConfiguration,
);

/**
 * Service for heats
 */
export const RegattaService = new Service(
  {
    regatta: Regatta,
    heat: Heat,
  },
  databaseConfiguration,
);
