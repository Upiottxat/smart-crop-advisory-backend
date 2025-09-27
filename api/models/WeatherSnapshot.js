const mongoose = require('mongoose');
const WeatherSnapshotSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  fetchedAt: { type: Date, default: Date.now },
  forecast: Object
});
module.exports = mongoose.model('WeatherSnapshot', WeatherSnapshotSchema);
