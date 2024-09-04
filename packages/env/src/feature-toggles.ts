const POINTS_PHASE_1 =
  import.meta.env.VITE_FEATURE_TOGGLE_POINTS_PHASE_1 === "true";

export const featureToggles = {
  POINTS_PHASE_1,
} as const;

export type FeatureToggle = keyof typeof featureToggles;
