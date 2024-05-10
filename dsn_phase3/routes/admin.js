const express = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, User } = require("../db"); // Assuming you have User schema defined
const router = express.Router();

// Admin signup route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if an admin with this username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new admin
        const newAdmin = await Admin.create({ username, password });
        res.json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the admin in the database
        const admin = await Admin.findOne({ username, password });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Admin logged in successfully', admin });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new user by admin
router.post('/user/add', adminMiddleware, async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if a user with this username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new user
        const newUser = await User.create({ username, password });
        res.json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a user by admin
router.delete('/user/delete/:id', adminMiddleware, async (req, res) => {
    const userId = req.params.id;

    try {
        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login route
router.post('/user/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'User logged in successfully', user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User profile route (for viewing own details)
router.get('/user/profile', async (req, res) => {
    try {
        // Assume the user's ID is available in the request object (e.g., req.user.id)
        const userId = req.user.id;

        // Find the user by ID in the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the user's profile information in the response
        res.json({
            message: 'User profile retrieved successfully',
            user: {
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                age: user.age,
                address: user.address,
                // Add other user profile fields as needed
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Other routes for managing attendance, salary, events, announcements, etc. can be added as needed

module.exports = router;
