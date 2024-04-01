import { RegattaService } from "@qra-website/core";
import { cache } from "react";
import "server-only"; // This ensures this library will never under any circumstances be included in the client bundle

/**
 * Method to preload the date values. This can be called before the data is
 * required to asynchronously fetch and cache it
 * @param dateLower the lower bound on date, optional
 * @param dateUpper the upper bound on date, optional
 */
export const preload = (dateLower?: Date, dateUpper?: Date) => {
  void getHeatsByDate(dateLower, dateUpper);
};

/**
 * Method to asynchronously fetch heats between the provided dates
 * @param dateLower the lower bound on date, optional
 * @param dateUpper the upper bound on date, optional
 * @returns a list of heats, being the heats that occur between the provided dates
 */
export const getHeatsByDate = cache(
  async (dateLower?: Date, dateUpper?: Date) => {
    return (
      (
        await RegattaService.entities.heat.query
          .heatsByDate({})
          .between(
            {
              scheduledStart: dateLower?.getTime(),
            },
            {
              scheduledStart: dateUpper?.getTime(),
            },
          )
          .go()
      )// Coerce dates to date objects
      .data
        .map((heat) => {
          return {
            ...heat,
            scheduledStart: new Date(heat.scheduledStart),
          };
        })
    );
  },
);
