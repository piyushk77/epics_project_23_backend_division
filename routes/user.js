const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ManagementMetrics = require('../models/ManagementMetrics');
const { calculateTaskMetrics } = require('../tools/managementMetricsUtils');
const { checkTarget } = require('../tools/checkTarget');

// Protected route - requires authentication

router.get('/getMetrics', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Query management metrics for the specific user
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

router.post('/addUser', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { username, useremail, phone, address, country, supervisor} = req.body;

    // Find the user metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }

    // Create a new expense transaction
    const newUser = {
      username,
      useremail,
      phone,
      address,
      country,
    };

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

router.post('/addAttendance', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { date, username, useremail, department, status} = req.body;

    // Find the user metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }

    // Create a new expense transaction
    const newAttendance = {
      date,
      username,
      useremail,
      department,
      status,
    };

    managementMetrics.attendance.push(newAttendance);

    await managementMetrics.save();

    res.status(201).json({ message: 'Attendance added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/addAnnouncement', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { description } = req.body;

    // Find the user metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }

    // Create a new expense transaction
    const newAnnouncement = {
      description
    };

    managementMetrics.announcements.push(newAnnouncement);

    await managementMetrics.save();

    res.status(201).json({ message: 'Announcement added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/addTask', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { description, date, department, assigned_to, status} = req.body;

    // Preprocess the date

    const formattedDate = convertDateFormat(date);

    // Find the management metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }

    // Create a new income transaction...
    const newTask = {
      description,
      date: formattedDate,
      department,
      assigned_to,
      status,
    };

    managementMetrics.task_metrics.tasks.push(newTask);

    await managementMetrics.save();

    const taskMetrics = calculateTaskMetrics(managementMetrics);

    managementMetrics.task_metrics.performance_this_week = taskMetrics.thisWeekPerformance;
    managementMetrics.task_metrics.performance_this_month = taskMetrics.thisMonthPerformance;
    managementMetrics.task_metrics.performance_this_year = taskMetrics.thisYearPerformance;
    managementMetrics.task_metrics.total_tasks = taskMetrics.totalTasks;

    // Update weekly and monthly values
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

router.post('/setTarget', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { target_type, percentage_alert, description, } = req.body;

    // Find the management metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'Management metrics not found for the user' });
    }

    // Create a new income transaction...
    const target = {
      target_type,
      percentage_alert,
      description,
    };

    managementMetrics.target = { ...target };

    await managementMetrics.save();

    checkTarget(managementMetrics);

    res.status(201).json({ message: 'Target added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deleteUser', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { baseUserId } = req.body; // Assuming you send the baseUserId in the request body

    // Find the management metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }

    // Find the index of the transaction with the given baseUserId
    const userIndex = managementMetrics.users.findIndex(
      (user) => { user._id.toString() === baseUserId; return user._id.toString() === baseUserId; }
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the transaction from the array
    managementMetrics.users.splice(userIndex, 1);

    // Save the changes
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

router.delete('/deleteTask', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { taskId } = req.body; // Assuming you send the taskId in the request body

    // Find the management metrics entry for the user
    const managementMetrics = await ManagementMetrics.findOne({ userId });

    if (!managementMetrics) {
      return res.status(404).json({ message: 'User metrics not found for the user' });
    }

    // Find the index of the transaction with the given transactionId
    const taskIndex = managementMetrics.task_metrics.tasks.findIndex(
      (task) => { task._id.toString() === taskId; return task._id.toString() === taskId; }
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the transaction from the array
    managementMetrics.task_metrics.tasks.splice(taskIndex, 1);

    // Save the changes
    await managementMetrics.save();

    const taskMetrics = calculateTaskMetrics(managementMetrics);

    managementMetrics.task_metrics.performance_this_week = taskMetrics.thisWeekPerformance;
    managementMetrics.task_metrics.performance_this_month = taskMetrics.thisMonthPerformance;
    managementMetrics.task_metrics.performance_this_year = taskMetrics.thisYearPerformance;
    managementMetrics.task_metrics.total_tasks = taskMetrics.totalTasks;

    // Update weekly and monthly values
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

function convertDateFormat(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for month
  const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits for day
  return `${year}-${month}-${day}`;
}

module.exports = router;
