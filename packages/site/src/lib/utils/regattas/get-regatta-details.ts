import { RegattaService } from "@qra-website/core";
import { cache } from "react";

/**
 * Method to asynchronously preload and cache details about the requested regatta, so that when it is retrieved, its details are cached
 * @param regattaId the regatta to query information about
 */
export const preload = (regattaId: string) => {
  void getRegattaDetails(regattaId);
};

/**
 * Method to fetch the details about a given regatta, including all of its heat information, by its ID
 * @param regattaId the ID of the regatta to query details and heats for
 * @returns all information about the requested regatta
 */
export const getRegattaDetails = cache(async (regattaId: string) => {
  const data = (
    await RegattaService.collections
      .regatta({
        regattaId: regattaId,
      })
      .go()
  ).data;

  // Coerce dates to date objects and return
  return {
    regatta: data.regatta.map((regatta) => {
      return {
        ...regatta,
        startDate: new Date(regatta.startDate),
        endDate: new Date(regatta.endDate),
      };
    }),
    heat: data.heat.map((heat) => {
      return {
        ...heat,
        scheduledStart: new Date(heat.scheduledStart),
      };
    }),
  };
});
