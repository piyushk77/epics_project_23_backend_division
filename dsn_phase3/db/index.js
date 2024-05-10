    const mongoose = require('mongoose');

    // Connect to MongoDB
    mongoose.connect('mongodb://localhost:27017/dsn-phase3');

    // Define schemas
    const AdminSchema = new mongoose.Schema({
        // Schema definition here
        username: String,
        password: String
    });
    const UserSchema = new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        fullName: { type: String },
        age: { type: Number },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            zipCode: { type: String }
        }
        // Add other fields as needed
    });

    const Admin = mongoose.model('Admin', AdminSchema);
    const User = mongoose.model('User', UserSchema);

    module.exports = {
        Admin,
        User
    }
