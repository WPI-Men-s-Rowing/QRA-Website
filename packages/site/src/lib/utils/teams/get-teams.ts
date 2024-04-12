import { TeamService } from "@qra-website/core/dynamo-db";
import { cache } from "react";
import "server-only"; // This ensures this library will never under any circumstances be included in the client bundle

/**
 * Method to preload team(s) with the provided name
 * @param teamName the name of the team to query, optional. If not provided, a query for all teams will be cached
 */
export const preload = (teamName?: string) => {
  void getTeams(teamName);
};

/**
 * Method to fetch summary data about either a singular team or all teams
 * @param teamName the name of the team to fetch, if a singular team is desired. Otherwise, all teams will be returned
 * @returns a list of regatta summary information for the regattas that fall within the given date ranges
 */
export const getTeams = cache(async (teamName?: string) => {
  return (await TeamService.entities.team.query.team({ name: teamName }).go())
    .data;
});
