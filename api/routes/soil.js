const express = require('express');
const router = express.Router();
const SoilReading = require('../models/SoilReading');
const WeatherSnapshot = require('../models/WeatherSnapshot');
const { generateRecommendation } = require('../services/recommendationService');
const auth = require('../middlewares/auth')();

router.post('/:farmId', auth, async (req, res) => {
  const farmId = req.params.farmId;
  const reading = await SoilReading.create({ farm: farmId, ...req.body });
  const latestWeather = await WeatherSnapshot.findOne({ farm: farmId }).sort({ fetchedAt: -1 });
  // generate recommendation (sync) — could be queued
  const rec = await generateRecommendation(farmId, reading, latestWeather?.forecast || {});
  res.status(201).json({ reading, recommendation: rec });
});

module.exports = router;
