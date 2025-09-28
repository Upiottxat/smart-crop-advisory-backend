const Recommendation = require('../models/Recommendation');
const fetch = require('node-fetch');

async function generateRecommendation(farmId, latestSoil, latestWeather) {
  const rec = { farm: farmId, dataUsed: { latestSoil, latestWeather }, title: '', description: '', tags: [], severity: 'info' };

  // If ML service available, call it
  const mlUrl = process.env.ML_SERVICE_URL;
  if (mlUrl) {
    try {
      const res = await fetch(mlUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soil: latestSoil, weather: latestWeather })
      });
      if (res.ok) {
        const body = await res.json();
        // expected: { title, description, severity, tags }
        Object.assign(rec, body);
        return await Recommendation.create(rec);
      }
    } catch (err) {
      console.warn('ML service call failed, falling back to rule engine', err.message);
    }
  }

  // fallback rule-based
  if (latestSoil && latestSoil.pH < 5.5) {
    rec.title = 'Soil too acidic — consider liming';
    rec.description = `pH ${latestSoil.pH} is low. Apply agricultural lime as per lab recommendation.`;
    rec.severity = 'action';
    rec.tags.push('soil','pH','fertility');
  } else if (latestSoil && latestSoil.moisture < 20 && latestWeather && latestWeather.forecast?.daily?.[0]?.precipitation < 5) {
    rec.title = 'Low moisture — irrigation recommended';
    rec.description = `Soil moisture ${latestSoil.moisture}%. Rain not expected. Irrigate accordingly.`;
    rec.severity = 'urgent';
    rec.tags.push('irrigation');
  } else {
    rec.title = 'Conditions acceptable';
    rec.description = 'No immediate action required. Continue monitoring.';
    rec.severity = 'info';
  }
  return await Recommendation.create(rec);
}

module.exports = { generateRecommendation };
