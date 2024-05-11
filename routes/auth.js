const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const ManagementMetrics = require('../models/ManagementMetrics');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(202).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Set userId to the exact _id value
    newUser.userId = newUser._id;

    await newUser.save();

    const newManagementMetrics = new ManagementMetrics({
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      task_metrics: {
        performance_this_week: 0,
        performance_this_month: 0,
        performance_this_year: 0,
        total_tasks: 0,
        total_users: 0,
        weekly: {
          firstWeek: 0,
          secondWeek: 0,
          thirdWeek: 0,
          fourthWeek: 0,
          fifthWeek: 0,
        },
        monthly: {
          january: 0,
          february: 0,
          march: 0,
          april: 0,
          may: 0,
          june: 0,
          july: 0,
          august: 0,
          september: 0,
          october: 0,
          november: 0,
          december: 0,
        },
        tasks: [],
      },
      users: [],
      attendance: [],
      announcements: [],
      target: {
        target_type: "",
        percentage_alert: 100,
        description: "",
      },
    });

    await newManagementMetrics.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(201).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: '5h',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;