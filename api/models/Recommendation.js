const mongoose = require('mongoose');
const RecommendationSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  createdAt: { type: Date, default: Date.now },
  title: String,
  description: String,
  severity: { type: String, enum: ['info','action','urgent'], default: 'info' },
  tags: [String],
  dataUsed: Object
});
module.exports = mongoose.model('Recommendation', RecommendationSchema);
