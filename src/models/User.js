const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['farmer','agronomist','admin'], default: 'farmer' },
  phone: String,
  farmIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
