import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractJsonFromText, validatePlanSchema } from '../lib/schema-validator.js';

describe('Schema Validator & Backtick Sanitizer Module', () => {
  it('24. should strip markdown backtick codeblocks from model output', () => {
    const raw = '```json\n{"confidence_score": 95}\n```';
    const clean = extractJsonFromText(raw);
    assert.equal(clean, '{"confidence_score": 95}');
  });

  it('25. should handle bare JSON without markdown fences', () => {
    const raw = '{"confidence_score": 90}';
    const clean = extractJsonFromText(raw);
    assert.equal(clean, '{"confidence_score": 90}');
  });

  it('26. should validate a conforming PlateWise rescue plan object', () => {
    const validPlan = {
      confidence_score: 96,
      executive_summary: 'Rescue plan prioritizes urgent dairy and greens.',
      day_by_day_plan: [
        {
          day: 1,
          priority: 'CRITICAL_USE_FIRST',
          target_ingredients: ['Spinach', 'Cream'],
          recipe_title: 'Creamy Spinach Pasta',
          prep_time_mins: 15,
          difficulty: 'Easy',
          instructions: ['Boil pasta', 'Sauté spinach in cream'],
          waste_avoided_reasoning: 'Rescues 1-day dairy.'
        }
      ],
      storage_hacks: ['Keep herbs dry']
    };

    const result = validatePlanSchema(validPlan);
    assert.equal(result.valid, true);
    assert.equal(result.data.confidence_score, 96);
    assert.equal(result.data.day_by_day_plan.length, 1);
  });

  it('27. should reject invalid model output (missing day_by_day_plan)', () => {
    const invalidPlan = {
      confidence_score: 80,
      executive_summary: 'Incomplete'
    };
    const result = validatePlanSchema(invalidPlan);
    assert.equal(result.valid, false);
    assert.match(result.error, /day_by_day_plan/i);
  });

  it('28. should reject null or non-object payloads', () => {
    assert.equal(validatePlanSchema(null).valid, false);
    assert.equal(validatePlanSchema('not json').valid, false);
    assert.equal(validatePlanSchema([]).valid, false);
  });
});
