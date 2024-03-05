const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  usertype: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
