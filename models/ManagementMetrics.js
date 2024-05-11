const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId },
  description: String,
  date: String,
  department: String,
  assigned_to: String,
  status: String,
});

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  username: String,
  useremail: String,
  phone: Number,
  address: String,
  country: String,
});

const attendanceSchema = new mongoose.Schema({
  date: String,
  username: String,
  useremail: String,
  department: String,
  status: String,
});

const announcementSchema = new mongoose.Schema({
  description: String,
});

const managementMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  email: String,
  task_metrics: {
    performance_this_week: Number,
    performance_this_month: Number,
    performance_this_year: Number,
    total_tasks: Number,
    total_users: Number,
    weekly: {
      firstWeek: Number,
      secondWeek: Number,
      thirdWeek: Number,
      fourthWeek: Number,
      fifthWeek: Number,
    },
    monthly: {
      january: Number,
      february: Number,
      march: Number,
      april: Number,
      may: Number,
      june: Number,
      july: Number,
      august: Number,
      september: Number,
      october: Number,
      november: Number,
      december: Number,
    },
    tasks: [taskSchema],
  },
  users: [userSchema],
  attendance: [attendanceSchema],
  announcements: [announcementSchema],
  target: {
    target_type: String,
    percentage_alert: Number,
    description: String,
  },
});

const ManagementMetrics = mongoose.model('ManagementMetrics', managementMetricsSchema, 'managementMetrics');

module.exports = ManagementMetrics;

