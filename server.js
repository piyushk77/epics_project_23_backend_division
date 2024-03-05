require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/staffManagement');

// mongoose.connect('add atlas mongodb link');


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user')); 

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
