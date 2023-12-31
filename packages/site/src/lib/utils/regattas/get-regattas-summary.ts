import { RegattaService } from "@qra-website/core";
import { cache } from "react";
import "server-only"; // This ensures this library will never under any circumstances be included in the client bundle

/**
 * Method to preload the date values. This can be called before the data is required to asynchronously fetch and cache it
 * @param startDateLower the lower bound on the start date, optional
 * @param endDateLower the lower bound on the end date, optional
 * @param startDateUpper the upper bound on the start date, optional
 * @param endDateUpper the upper bound on the end date, optional
 */
export const preload = (
  startDateLower?: Date,
  endDateLower?: Date,
  startDateUpper?: Date,
  endDateUpper?: Date,
) => {
  void getRegattasSummary(
    startDateLower,
    endDateLower,
    startDateUpper,
    endDateUpper,
  );
};

/**
 * Method to fetch summary data about all regattas that fall within the provided time window
 * @param startDateLower the lowest acceptable start date to include in results. Optional
 * @param endDateLower the lowest acceptable end date to include in results. Optional
 * @param startDateUpper the highest acceptable start date to include in results. Optional
 * @param endDateUpper the highest acceptable end date to include in results. Optional
 * @returns a list of regatta summary information for the regattas that fall within the given date ranges
 */
export const getRegattasSummary = cache(
  async (
    startDateLower?: Date,
    endDateLower?: Date,
    startDateUpper?: Date,
    endDateUpper?: Date,
  ) => {
    return (
      await RegattaService.entities.regatta.query
        .regattaSummary({})
        .between(
          {
            startDate: startDateLower?.getTime(),
            endDate: endDateLower?.getTime(),
          },
          {
            startDate: startDateUpper?.getTime(),
            endDate: endDateUpper?.getTime(),
          },
        )
        .go()
    ).data;
  },
);
