const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Metrics = require('../models/Metrics');

// Get user data by email
router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find metrics for the user
    const metrics = await Metrics.findOne({ userId: user._id });

    // If metrics are not found for the user, handle accordingly
    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found for this user' });
    }

    // Return user data along with metrics
    res.status(200).json({ user, metrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
