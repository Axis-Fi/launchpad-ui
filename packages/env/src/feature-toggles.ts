const POINTS_PHASE_1 =
  import.meta.env.VITE_FEATURE_TOGGLE_POINTS_PHASE_1 === "true";

const REGISTRATION_LAUNCHES =
  import.meta.env.VITE_FEATURE_TOGGLE_REGISTRATION_LAUNCHES === "true";

export const featureToggles = {
  POINTS_PHASE_1,
  REGISTRATION_LAUNCHES,
} as const;

export type FeatureToggle = keyof typeof featureToggles;
