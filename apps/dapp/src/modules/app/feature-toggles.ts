const REGISTRATION_LAUNCHES =
  import.meta.env.VITE_FEATURE_TOGGLE_REGISTRATION_LAUNCHES === "true";

export const featureToggles = {
  REGISTRATION_LAUNCHES,
} as const;

export type FeatureToggle = keyof typeof featureToggles;
