const express = require('express');
const router = express.Router();
const Metrics = require('../models/Metrics');

// Endpoint to save metrics data
router.post('/', async (req, res) => {
  try {
    const { userId, attendance, salary, leaveTaken, designation, performanceRating, trainingHours, projectsCompleted, skills, joiningDate, managerId, performanceNotes, certifications } = req.body;

    // Create a new metrics object
    const newMetrics = new Metrics({
      userId,
      attendance,
      salary,
      leaveTaken,
      designation,
      performanceRating,
      trainingHours,
      projectsCompleted,
      skills,
      joiningDate,
      managerId,
      performanceNotes,
      certifications
    });

    // Save the metrics data to the database
    await newMetrics.save();

    res.status(201).json({ message: 'Metrics data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
