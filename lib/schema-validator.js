/**
 * @fileoverview Pure functions for validating and sanitizing Gemini model JSON output.
 * @module lib/schema-validator
 */

/**
 * Strips markdown code block wrappers (```json ... ```) from model raw text.
 *
 * @param {unknown} rawText - Raw text string from the model.
 * @returns {string} Clean JSON string.
 */
export function extractJsonFromText(rawText) {
  if (typeof rawText !== 'string') return '';
  return rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Validates that an object conforms to the required PlateWise rescue plan schema.
 *
 * @param {unknown} obj - Parsed JSON object.
 * @returns {{valid: boolean, data?: any, error?: string}}
 */
export function validatePlanSchema(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { valid: false, error: 'Output must be a non-null JSON object.' };
  }

  const record = /** @type {Record<string, unknown>} */ (obj);

  if (!Array.isArray(record.day_by_day_plan) || record.day_by_day_plan.length === 0) {
    return { valid: false, error: 'Plan must include day_by_day_plan array.' };
  }

  const validDays = [];
  for (const dayItem of record.day_by_day_plan) {
    if (!dayItem || typeof dayItem !== 'object') continue;
    const d = /** @type {Record<string, unknown>} */ (dayItem);
    
    validDays.push({
      day: parseInt(String(d.day), 10) || (validDays.length + 1),
      priority: String(d.priority || 'USE_FIRST'),
      target_ingredients: Array.isArray(d.target_ingredients) ? d.target_ingredients.map(String) : [],
      recipe_title: String(d.recipe_title || 'Rescue Recipe'),
      prep_time_mins: parseInt(String(d.prep_time_mins), 10) || 20,
      difficulty: String(d.difficulty || 'Easy'),
      instructions: Array.isArray(d.instructions) ? d.instructions.map(String) : ['Cook and serve.'],
      waste_avoided_reasoning: String(d.waste_avoided_reasoning || 'Reduces waste.')
    });
  }

  if (validDays.length === 0) {
    return { valid: false, error: 'No valid day plans found.' };
  }

  const confidence = Math.min(99, Math.max(50, parseInt(String(record.confidence_score), 10) || 94));
  const summary = String(record.executive_summary || 'Sequential rescue plan synthesized.');
  const hacks = Array.isArray(record.storage_hacks) ? record.storage_hacks.map(String) : [];

  return {
    valid: true,
    data: {
      confidence_score: confidence,
      executive_summary: summary,
      day_by_day_plan: validDays,
      storage_hacks: hacks
    }
  };
}
