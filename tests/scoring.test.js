import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getBaseDecayUrgency,
  calculateSpoilageRisk,
  calculateEnvironmentalImpact
} from '../lib/scoring.js';

describe('Scoring & Impact Tools Module', () => {
  it('14. should compute non-linear decay curve with highest hazard for immediate expiry', () => {
    assert.equal(getBaseDecayUrgency(0), 98);
    assert.equal(getBaseDecayUrgency(1), 90);
    assert.equal(getBaseDecayUrgency(2), 78);
    assert.equal(getBaseDecayUrgency(3), 65);
    assert.equal(getBaseDecayUrgency(5), 45);
    assert.equal(getBaseDecayUrgency(7), 25);
    assert.equal(getBaseDecayUrgency(30), 10);
  });

  it('15. should sort scored ingredients in descending order of spoilage risk', () => {
    const items = [
      { name: 'Brown Rice', category: 'pantry', daysLeft: 30, quantity: 1 },
      { name: 'Fresh Salmon', category: 'meat', daysLeft: 1, quantity: 1 },
      { name: 'Apples', category: 'produce', daysLeft: 5, quantity: 2 }
    ];
    const scored = calculateSpoilageRisk(items);
    assert.equal(scored[0].name, 'Fresh Salmon');
    assert.equal(scored[scored.length - 1].name, 'Brown Rice');
    assert.ok(scored[0].riskScore > scored[1].riskScore);
  });

  it('16. should apply category multipliers correctly (meat has higher risk than pantry)', () => {
    const meat = [{ name: 'Beef', category: 'meat', daysLeft: 2, quantity: 1 }];
    const pantry = [{ name: 'Flour', category: 'pantry', daysLeft: 2, quantity: 1 }];
    const scoredMeat = calculateSpoilageRisk(meat);
    const scoredPantry = calculateSpoilageRisk(pantry);
    assert.ok(scoredMeat[0].riskScore > scoredPantry[0].riskScore);
  });

  it('17. should assign correct urgency tags based on score thresholds', () => {
    const urgent = calculateSpoilageRisk([{ name: 'Fish', category: 'meat', daysLeft: 0, quantity: 1 }]);
    assert.match(urgent[0].urgency, /Critical/i);

    const moderate = calculateSpoilageRisk([{ name: 'Rice', category: 'pantry', daysLeft: 40, quantity: 1 }]);
    assert.equal(moderate[0].urgency, 'Low');
  });

  it('18. should compute empirical carbon avoidance and financial savings correctly', () => {
    const items = [
      { name: 'Chicken', category: 'meat', daysLeft: 1, quantity: 2, riskScore: 90 },
      { name: 'Spinach', category: 'produce', daysLeft: 1, quantity: 1, riskScore: 85 }
    ];
    const impact = calculateEnvironmentalImpact(items);
    assert.ok(impact.totalRescuedKg > 0);
    assert.ok(impact.totalCo2eAvoidedKg > 0);
    assert.ok(impact.totalMoneySavedUsd > 0);
    assert.ok(impact.overallRiskIndex >= 85);
  });

  it('19. should handle empty or invalid scored arrays gracefully', () => {
    const impactEmpty = calculateEnvironmentalImpact([]);
    assert.equal(impactEmpty.totalRescuedKg, 0);
    assert.equal(impactEmpty.totalCo2eAvoidedKg, 0);
    assert.equal(impactEmpty.totalMoneySavedUsd, 0);
    assert.equal(impactEmpty.overallRiskIndex, 0);
  });
});
