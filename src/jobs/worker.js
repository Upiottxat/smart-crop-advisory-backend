// Example BullMQ worker that would process queued soil readings and call recommendation generator.
const { Worker, Queue } = require('bullmq');
const { generateRecommendation } = require('../services/recommendationService');
const SoilReading = require('../models/SoilReading');
const WeatherSnapshot = require('../models/WeatherSnapshot');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL);

const queue = new Queue('soil-readings', { connection });

const worker = new Worker('soil-readings', async job => {
  const { soilReadingId } = job.data;
  const reading = await SoilReading.findById(soilReadingId);
  const latestWeather = await WeatherSnapshot.findOne({ farm: reading.farm }).sort({ fetchedAt: -1 });
  await generateRecommendation(reading.farm, reading, latestWeather?.forecast || {});
}, { connection });

module.exports = { queue };
