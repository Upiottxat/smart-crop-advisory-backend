const mongoose = require('mongoose');
const FarmSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  areaHectares: Number,
  soilType: String,
  createdAt: { type: Date, default: Date.now }
});
FarmSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Farm', FarmSchema);
