const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String},
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
