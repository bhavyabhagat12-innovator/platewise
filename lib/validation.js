/**
 * @fileoverview Pure functions for input validation, sanitization, and prompt-injection defense.
 * @module lib/validation
 */

import { ALLOWED_CATEGORIES, LIMITS } from './config.js';

/**
 * Sanitizes a raw string by stripping control characters, brackets, HTML, and script patterns.
 *
 * @param {unknown} input - Raw input string to clean.
 * @param {number} [maxLength=LIMITS.MAX_NAME_LENGTH] - Maximum allowed length.
 * @returns {string} Clean, safe string.
 */
export function sanitizeString(input, maxLength = LIMITS.MAX_NAME_LENGTH) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>{}[\]\\]/g, '') // Strip brackets and injection delimiters
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Clamps a numeric value between a minimum and maximum bound.
 *
 * @param {unknown} value - Value to coerce and clamp.
 * @param {number} min - Minimum allowed integer.
 * @param {number} max - Maximum allowed integer.
 * @param {number} fallback - Fallback if value is NaN.
 * @returns {number} Clamped integer.
 */
export function clampInteger(value, min, max, fallback) {
  const parsed = parseInt(String(value), 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

/**
 * Validates and sanitizes a single ingredient object.
 *
 * @param {unknown} item - Raw ingredient object.
 * @returns {null|{name: string, category: string, daysLeft: number, quantity: number}}
 */
export function sanitizeIngredient(item) {
  if (!item || typeof item !== 'object') return null;

  const rawItem = /** @type {Record<string, unknown>} */ (item);
  const cleanName = sanitizeString(rawItem.name, LIMITS.MAX_NAME_LENGTH);
  if (!cleanName) return null;

  const rawCat = String(rawItem.category || '').toLowerCase().trim();
  const cleanCategory = ALLOWED_CATEGORIES.includes(rawCat) ? rawCat : 'produce';

  const cleanDays = clampInteger(
    rawItem.daysLeft,
    LIMITS.MIN_DAYS_LEFT,
    LIMITS.MAX_DAYS_LEFT,
    0
  );

  const cleanQty = clampInteger(
    rawItem.quantity,
    LIMITS.MIN_QUANTITY,
    LIMITS.MAX_QUANTITY,
    1
  );

  return {
    name: cleanName,
    category: cleanCategory,
    daysLeft: cleanDays,
    quantity: cleanQty
  };
}

/**
 * Validates and sanitizes an entire batch of ingredients from a request body.
 *
 * @param {unknown} ingredients - Raw ingredients input.
 * @returns {{valid: boolean, error?: string, data?: Array<{name: string, category: string, daysLeft: number, quantity: number}>}}
 */
export function validateIngredientsBatch(ingredients) {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return {
      valid: false,
      error: 'Please provide at least one ingredient to analyze.'
    };
  }

  if (ingredients.length > LIMITS.MAX_INGREDIENTS) {
    return {
      valid: false,
      error: `Maximum ${LIMITS.MAX_INGREDIENTS} ingredients allowed per batch analysis.`
    };
  }

  const sanitized = [];
  for (const item of ingredients) {
    const clean = sanitizeIngredient(item);
    if (clean) {
      sanitized.push(clean);
    }
  }

  if (sanitized.length === 0) {
    return {
      valid: false,
      error: 'No valid ingredients found after sanitization.'
    };
  }

  return {
    valid: true,
    data: sanitized
  };
}

/**
 * Sanitizes dietary notes or kitchen style constraints.
 *
 * @param {unknown} dietaryNotes - Raw dietary string.
 * @returns {string} Sanitized string or empty string.
 */
export function sanitizeDietaryNotes(dietaryNotes) {
  return sanitizeString(dietaryNotes, LIMITS.MAX_DIETARY_LENGTH);
}
