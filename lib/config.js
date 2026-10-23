/**
 * @fileoverview Central configuration constants and magic numbers for PlateWise.
 * @module lib/config
 */

/**
 * Benchmark constants for perishability, emissions, and financial valuations.
 * Derived from United Nations FAO and WRAP UK food waste lifecycle analyses.
 */
export const METRICS_TABLE = Object.freeze({
  produce: Object.freeze({
    co2PerKg: 0.85,
    costPerKg: 3.40,
    avgWeightKg: 0.35,
    perishabilityRisk: 1.35
  }),
  dairy: Object.freeze({
    co2PerKg: 3.20,
    costPerKg: 4.80,
    avgWeightKg: 0.50,
    perishabilityRisk: 1.55
  }),
  meat: Object.freeze({
    co2PerKg: 14.8,
    costPerKg: 13.50,
    avgWeightKg: 0.45,
    perishabilityRisk: 1.70
  }),
  bakery: Object.freeze({
    co2PerKg: 1.35,
    costPerKg: 3.90,
    avgWeightKg: 0.40,
    perishabilityRisk: 1.25
  }),
  pantry: Object.freeze({
    co2PerKg: 1.10,
    costPerKg: 2.80,
    avgWeightKg: 0.30,
    perishabilityRisk: 0.80
  })
});

/**
 * Whitelisted food categories supported by the classification model.
 */
export const ALLOWED_CATEGORIES = Object.freeze([
  'produce',
  'dairy',
  'meat',
  'bakery',
  'pantry'
]);

/**
 * Input sanitization and bounds configuration.
 */
export const LIMITS = Object.freeze({
  MAX_INGREDIENTS: 25,
  MAX_NAME_LENGTH: 50,
  MAX_DIETARY_LENGTH: 100,
  MAX_DAYS_LEFT: 365,
  MIN_DAYS_LEFT: 0,
  MAX_QUANTITY: 50,
  MIN_QUANTITY: 1,
  DEFAULT_WEIGHT_KG: 0.15
});

/**
 * Sliding-window rate limiter settings.
 */
export const RATE_LIMIT_CONFIG = Object.freeze({
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 25
});

/**
 * Google Gemini model defaults.
 */
export const GEMINI_CONFIG = Object.freeze({
  DEFAULT_MODEL: 'gemini-1.5-flash',
  TEMPERATURE: 0.2,
  MAX_OUTPUT_TOKENS: 2048,
  RESPONSE_MIME_TYPE: 'application/json'
});
