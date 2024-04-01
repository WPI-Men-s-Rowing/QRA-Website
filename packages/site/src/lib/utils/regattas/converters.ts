import { RegattaService } from "@qra-website/core";
import { CollectionItem, EntityItem } from "electrodb";

/**
 * Converts a heat (as it would be returned from the DB) to one that can be used
 * in the frontend (e.g., with more useful types)
 * @param heat the heat to convert
 * @returns the converted heat, with more useful typings
 */
export function convertDbHeatToHeat(
  heat: EntityItem<typeof RegattaService.entities.heat>,
) {
  return {
    ...heat,
    scheduledStart: new Date(heat.scheduledStart),
  };
}

/**
 * Converts a regatta (as it would be returned from the DB) to one containing
 * more useful typings for easier use in the frontend
 * @param regattaSummary the regatta as returned from the DB
 * @returns a regatta created with more useful typings
 */
export function convertDbRegattaSummaryToRegattaSummary(
  regattaSummary: EntityItem<typeof RegattaService.entities.regatta>,
) {
  return {
    ...regattaSummary,
    startDate: new Date(regattaSummary.startDate),
    endDate: new Date(regattaSummary.endDate),
  };
}

/**
 * Method to convert the DB returned regatta details to one with more useful types
 * @param regattaDetails the DB returned regatta details to display
 * @returns regatta details with more useful types, or null if the returned data has no regatta
 * @throws {Error} if the passed-in regatta details contain more than one regatta
 */
export function convertDbRegattaDetailsToRegattaDetails(
  regattaDetails: CollectionItem<typeof RegattaService, "regatta">,
) {
  // If we got no regatta
  if (regattaDetails.regatta.length === 0) {
    return null; // Return null
  } else if (regattaDetails.regatta.length !== 1) {
    // If we somehow got more than one regatta, throw
    throw new Error(
      `Invalid input - regatta details must have exactly one regatta (found ${regattaDetails.regatta.length})`,
    );
  }

  // Otherwise, return, call the converters for the subtypes
  return {
    regatta: convertDbRegattaSummaryToRegattaSummary(regattaDetails.regatta[0]),
    heat: regattaDetails.heat.map(convertDbHeatToHeat),
  };
}
