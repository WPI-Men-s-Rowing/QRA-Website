import type {
  convertDbBreakToBreak,
  convertDbHeatToHeat,
  convertDbRegattaSummaryToRegattaSummary,
} from "./converters";

// Types for heat, regatta, and break, as per their converters
export type Heat = ReturnType<typeof convertDbHeatToHeat>;
export type Regatta = ReturnType<
  typeof convertDbRegattaSummaryToRegattaSummary
>;
export type Break = ReturnType<typeof convertDbBreakToBreak>;
