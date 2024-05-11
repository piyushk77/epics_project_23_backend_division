require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;
const dbPassword = process.env.DB_PASSWORD;

app.use(cors());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://piyush:${dbPassword}@cluster0.cw1xijx.mongodb.net/staffManagement`);



// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user')); 

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
