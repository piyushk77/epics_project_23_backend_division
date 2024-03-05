const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendance: {
    type: Number,
    default: 0
  },
  salary: {
    type: Number,
    default: 0
  },
  leaveTaken: {
    type: Number,
    default: 0
  },
  designation: {
    type: String
  },
  performanceRating: {
    type: Number,
    default: 0
  },
  trainingHours: {
    type: Number,
    default: 0
  },
  projectsCompleted: {
    type: Number,
    default: 0
  },
  skills: {
    type: [String]
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  performanceNotes: {
    type: String
  },
  certifications: [{
    name: String,
    issuer: String,
    date: Date
  }]
});

const Metrics = mongoose.model('Metrics', metricsSchema, 'metrics');

module.exports = Metrics;
