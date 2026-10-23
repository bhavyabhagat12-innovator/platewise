/**
 * @fileoverview Pure deterministic scoring tools for spoilage decay and carbon/financial impact.
 * @module lib/scoring
 */

import { METRICS_TABLE, LIMITS } from './config.js';

/**
 * Computes base urgency score from days remaining until expiration.
 * Models an exponential non-linear hazard curve.
 *
 * @param {number} daysLeft - Days until expiry (clamped >= 0).
 * @returns {number} Base risk score (10 to 98).
 */
export function getBaseDecayUrgency(daysLeft) {
  if (daysLeft <= 0) return 98;
  if (daysLeft === 1) return 90;
  if (daysLeft === 2) return 78;
  if (daysLeft === 3) return 65;
  if (daysLeft <= 5) return 45;
  if (daysLeft <= 7) return 25;
  return 10;
}

/**
 * Calculates deterministic spoilage risk scores for each ingredient.
 * Results are sorted in descending order of risk (highest urgency first).
 *
 * @param {Array<{name: string, category: string, daysLeft: number, quantity: number}>} ingredients
 * @returns {Array<{name: string, category: string, daysLeft: number, quantity: number, riskScore: number, urgency: string}>}
 */
export function calculateSpoilageRisk(ingredients) {
  if (!Array.isArray(ingredients)) return [];

  return ingredients.map((item) => {
    const meta = METRICS_TABLE[item.category] || METRICS_TABLE.produce;
    const days = Math.max(0, parseInt(String(item.daysLeft), 10) || 0);
    const rawBase = getBaseDecayUrgency(days);

    const weightedScore = Math.min(
      100,
      Math.round(rawBase * (meta.perishabilityRisk / 1.2))
    );

    let urgencyTag = 'Low';
    if (weightedScore >= 75) {
      urgencyTag = 'Critical (Day 1)';
    } else if (weightedScore >= 50) {
      urgencyTag = 'High (Day 2)';
    } else if (weightedScore >= 30) {
      urgencyTag = 'Moderate (Day 3)';
    }

    return {
      name: item.name,
      category: item.category,
      daysLeft: days,
      quantity: item.quantity,
      riskScore: weightedScore,
      urgency: urgencyTag
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Computes empirical carbon avoidance (kg CO2e) and financial savings ($ USD)
 * based on peer-reviewed UN FAO and WRAP benchmarks.
 *
 * @param {Array<{name: string, category: string, daysLeft: number, quantity: number, riskScore: number}>} scoredIngredients
 * @returns {{totalRescuedKg: number, totalCo2eAvoidedKg: number, totalMoneySavedUsd: number, overallRiskIndex: number}}
 */
export function calculateEnvironmentalImpact(scoredIngredients) {
  if (!Array.isArray(scoredIngredients) || scoredIngredients.length === 0) {
    return {
      totalRescuedKg: 0,
      totalCo2eAvoidedKg: 0,
      totalMoneySavedUsd: 0,
      overallRiskIndex: 0
    };
  }

  let totalKg = 0;
  let totalCo2e = 0;
  let totalCost = 0;

  for (const item of scoredIngredients) {
    const meta = METRICS_TABLE[item.category] || METRICS_TABLE.produce;
    const itemWeightKg = Math.max(
      LIMITS.DEFAULT_WEIGHT_KG,
      Number((meta.avgWeightKg * (item.quantity || 1)).toFixed(2))
    );
    const itemCo2 = Number((itemWeightKg * meta.co2PerKg).toFixed(2));
    const itemCost = Number((itemWeightKg * meta.costPerKg).toFixed(2));

    totalKg += itemWeightKg;
    totalCo2e += itemCo2;
    totalCost += itemCost;
  }

  const avgRisk = Math.round(
    scoredIngredients.reduce((sum, item) => sum + (item.riskScore || 0), 0) /
      Math.max(1, scoredIngredients.length)
  );

  return {
    totalRescuedKg: Number(totalKg.toFixed(2)),
    totalCo2eAvoidedKg: Number(totalCo2e.toFixed(2)),
    totalMoneySavedUsd: Number(totalCost.toFixed(2)),
    overallRiskIndex: avgRisk
  };
}
