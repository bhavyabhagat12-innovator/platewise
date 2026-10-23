import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { processAgentAnalysis } from '../api/analyze.js';
import { generateDeterministicFallback } from '../lib/fallback.js';

describe('Agent Core Integration & Mock Testing', () => {
  const sampleIngredients = [
    { name: 'Baby Spinach', category: 'produce', daysLeft: 1, quantity: 2 },
    { name: 'Ground Turkey', category: 'meat', daysLeft: 1, quantity: 1 }
  ];

  it('29. should generate deterministic fallback with 3-day sequential rescue plan and storage hacks', () => {
    const scored = [
      { name: 'Turkey', category: 'meat', daysLeft: 1, quantity: 1, riskScore: 92 },
      { name: 'Bread', category: 'bakery', daysLeft: 3, quantity: 1, riskScore: 60 }
    ];
    const impact = { totalRescuedKg: 0.85, totalCo2eAvoidedKg: 7.2, totalMoneySavedUsd: 12.0, overallRiskIndex: 76 };
    
    const fallback = generateDeterministicFallback(scored, impact);
    assert.equal(fallback.is_demo_fallback, true);
    assert.equal(fallback.agent_status, 'FALLBACK_SUCCESS');
    assert.equal(fallback.day_by_day_plan.length, 3);
    assert.ok(fallback.storage_hacks.length >= 3);
    assert.ok(fallback.audit_trace.length >= 5);
  });

  it('30. should automatically engage fallback mode when GEMINI_API_KEY is missing or empty', async () => {
    const { statusCode, payload } = await processAgentAnalysis({
      rawIngredients: sampleIngredients,
      apiKey: '' // Missing key
    });

    assert.equal(statusCode, 200);
    assert.equal(payload.is_demo_fallback, true);
    assert.match(payload.notice, /Demonstration Mode/i);
    assert.equal(payload.day_by_day_plan.length, 3);
    assert.ok(payload.impact_metrics.totalRescuedKg > 0);
  });

  it('31. should gracefully failover to fallback mode when Gemini API returns HTTP 429/500 error', async () => {
    // Mock fetch that simulates Gemini API rate limiting (429)
    const mockRateLimitFetch = async () => ({
      ok: false,
      status: 429,
      text: async () => 'Resource exhausted: quota exceeded'
    });

    const { statusCode, payload } = await processAgentAnalysis({
      rawIngredients: sampleIngredients,
      apiKey: 'AIzaSyMockKeyForTest123',
      fetchFn: mockRateLimitFetch
    });

    assert.equal(statusCode, 200);
    assert.equal(payload.is_demo_fallback, true);
    assert.match(payload.notice, /Failover active/i);
    assert.equal(payload.day_by_day_plan.length, 3);
  });

  it('32. should successfully parse and assemble payload when Gemini API responds with structured JSON', async () => {
    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  confidence_score: 97,
                  executive_summary: 'Optimized rescue plan executed.',
                  day_by_day_plan: [
                    {
                      day: 1,
                      priority: 'CRITICAL_USE_FIRST',
                      target_ingredients: ['Baby Spinach', 'Ground Turkey'],
                      recipe_title: 'Turkey Spinach Skillet',
                      prep_time_mins: 20,
                      difficulty: 'Easy',
                      instructions: ['Brown the turkey', 'Fold in spinach until wilted'],
                      waste_avoided_reasoning: 'Rescues 1-day turkey immediately.'
                    }
                  ],
                  storage_hacks: ['Keep produce dry in sealed glass containers.']
                })
              }
            ]
          }
        }
      ]
    };

    const mockSuccessFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => mockGeminiResponse
    });

    const { statusCode, payload } = await processAgentAnalysis({
      rawIngredients: sampleIngredients,
      apiKey: 'AIzaSyMockKeyForTest123',
      fetchFn: mockSuccessFetch
    });

    assert.equal(statusCode, 200);
    assert.equal(payload.is_demo_fallback, false);
    assert.equal(payload.agent_status, 'SUCCESS');
    assert.equal(payload.confidence_score, 97);
    assert.equal(payload.day_by_day_plan[0].recipe_title, 'Turkey Spinach Skillet');
    assert.equal(payload.audit_trace.length, 5);
  });

  it('33. should catch network exceptions during API fetch and recover to fallback', async () => {
    const mockThrowingFetch = async () => {
      throw new Error('ECONNRESET socket hang up');
    };

    const { statusCode, payload } = await processAgentAnalysis({
      rawIngredients: sampleIngredients,
      apiKey: 'AIzaSyMockKeyForTest123',
      fetchFn: mockThrowingFetch
    });

    assert.equal(statusCode, 200);
    assert.equal(payload.is_demo_fallback, true);
    assert.match(payload.notice, /Network failover/i);
  });
});
