const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ManagementMetrics = require('../models/ManagementMetrics');
const { calculateTaskMetrics } = require('../tools/managementMetricsUtils');
const { checkTarget } = require('../tools/checkTarget');

// Protected route - requires authentication

// Fetch user metrics
router.get('/getMetrics', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const userMetrics = await ManagementMetrics.findOne({ userId });
    if (!userMetrics) {
      return res.status(404).json({ message: 'User metrics not found' });
    }
    res.status(200).json(userMetrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new user
router.post('/addUser', authMiddleware, async (req, res) => {
  try {
    // Implementation for adding a new user
    const userId = req.userId;
    const { username, useremail, phone, address, country, supervisor} = req.body;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const newUser = { username, useremail, phone, address, country };
    managementMetrics.users.push(newUser);
    const totalUsers = managementMetrics.users.length;
    managementMetrics.task_metrics.total_users = totalUsers;
    await managementMetrics.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add attendance data
router.post('/addAttendance', authMiddleware, async (req, res) => {
  try {
    // Implementation for adding attendance data
    const userId = req.userId;
    const { date, username, useremail, department, status} = req.body;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const newAttendance = { date, username, useremail, department, status };
    managementMetrics.attendance.push(newAttendance);
    await managementMetrics.save();
    res.status(201).json({ message: 'Attendance added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new announcement
router.post('/addAnnouncement', authMiddleware, async (req, res) => {
  try {
    // Implementation for adding a new announcement
    const userId = req.userId;
    const { description } = req.body;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const newAnnouncement = { description };
    managementMetrics.announcements.push(newAnnouncement);
    await managementMetrics.save();
    res.status(201).json({ message: 'Announcement added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new task
router.post('/addTask', authMiddleware, async (req, res) => {
  try {
    // Implementation for adding a new task
    const userId = req.userId;
    const { description, date, department, assigned_to, status} = req.body;
    const formattedDate = convertDateFormat(date);
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const newTask = { description, date: formattedDate, department, assigned_to, status };
    managementMetrics.task_metrics.tasks.push(newTask);
    await managementMetrics.save();
    const taskMetrics = calculateTaskMetrics(managementMetrics);
    managementMetrics.task_metrics.performance_this_week = taskMetrics.thisWeekPerformance;
    managementMetrics.task_metrics.performance_this_month = taskMetrics.thisMonthPerformance;
    managementMetrics.task_metrics.performance_this_year = taskMetrics.thisYearPerformance;
    managementMetrics.task_metrics.total_tasks = taskMetrics.totalTasks;
    taskMetrics.weeklyPerformance.then((resolvedValue) => {
      managementMetrics.task_metrics.weekly = { ...resolvedValue };
    });
    taskMetrics.monthlyPerformance.then((resolvedValue) => {
      managementMetrics.task_metrics.monthly = { ...resolvedValue };
    });
    await managementMetrics.save();
    checkTarget(managementMetrics);
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Set a target
router.post('/setTarget', authMiddleware, async (req, res) => {
  try {
    // Implementation for setting a target
    const userId = req.userId;
    const { target_type, percentage_alert, description } = req.body;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'Management metrics not found for the user' });
    }
    const target = { target_type, percentage_alert, description };
    managementMetrics.target = { ...target };
    await managementMetrics.save();
    checkTarget(managementMetrics);
    res.status(201).json({ message: 'Target added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a user
router.delete('/deleteUser', authMiddleware, async (req, res) => {
  try {
    // Implementation for deleting a user
    const userId = req.userId;
    const { baseUserId } = req.body;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const userIndex = managementMetrics.users.findIndex(user => user._id.toString() === baseUserId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    managementMetrics.users.splice(userIndex, 1);
    await managementMetrics.save();
    const totalUsers = managementMetrics.users.length;
    managementMetrics.task_metrics.total_users = totalUsers;
    await managementMetrics.save();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task
router.delete('/deleteTask', authMiddleware, async (req, res) => {
  try {
    // Implementation for deleting a task
    const userId = req.userId;
    const { taskId } = req.body;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const taskIndex = managementMetrics.task_metrics.tasks.findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    managementMetrics.task_metrics.tasks.splice(taskIndex, 1);
    await managementMetrics.save();
    const taskMetrics = calculateTaskMetrics(managementMetrics);
    managementMetrics.task_metrics.performance_this_week = taskMetrics.thisWeekPerformance;
    managementMetrics.task_metrics.performance_this_month = taskMetrics.thisMonthPerformance;
    managementMetrics.task_metrics.performance_this_year = taskMetrics.thisYearPerformance;
    managementMetrics.task_metrics.total_tasks = taskMetrics.totalTasks;
    taskMetrics.weeklyPerformance.then((resolvedValue) => {
      managementMetrics.task_metrics.weekly = { ...resolvedValue };
    });
    taskMetrics.monthlyPerformance.then((resolvedValue) => {
      managementMetrics.task_metrics.monthly = { ...resolvedValue };
    });
    await managementMetrics.save();
    checkTarget(managementMetrics);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch announcements
router.get('/fetchAnnouncements', authMiddleware, async (req, res) => {
  try {
    // Implementation for fetching announcements
    const userId = req.userId;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const announcements = managementMetrics.announcements;
    res.status(200).json({ announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch tasks
router.get('/fetchTasks', authMiddleware, async (req, res) => {
  try {
    // Implementation for fetching tasks
    const userId = req.userId;
    const managementMetrics = await ManagementMetrics.findOne({ userId });
    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }
    const tasks = managementMetrics.task_metrics.tasks;
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function convertDateFormat(inputDate) {
  // Date conversion function
}

module.exports = router;
