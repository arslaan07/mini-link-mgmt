const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userInitials: String,
});

module.exports = mongoose.model('User', userSchema);
