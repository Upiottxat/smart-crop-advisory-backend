const mongoose = require('mongoose');
const SoilReadingSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  timestamp: { type: Date, default: Date.now },
  pH: Number,
  moisture: Number,
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
  source: { type: String, enum: ['sensor','lab','manual'], default: 'sensor' }
});
module.exports = mongoose.model('SoilReading', SoilReadingSchema);
