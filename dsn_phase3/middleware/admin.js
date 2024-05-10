const { Admin } = require("../db");

// Middleware for handling admin authentication
function adminMiddleware(req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized - Admin token missing' });
    }

    // Assuming you have a function to verify the admin token
    // You should implement this function based on your authentication mechanism
    verifyAdminToken(authToken)
        .then(admin => {
            if (!admin) {
                return res.status(403).json({ error: 'Forbidden - Invalid admin token' });
            }
            req.admin = admin; // Attach admin object to request for use in routes
            next(); // Continue to the next middleware or route handler
        })
        .catch(error => {
            console.error('Error verifying admin token:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}

// Example function to verify admin token (replace with your actual implementation)
function verifyAdminToken(token) {
    // Implement token verification logic (e.g., decode and validate the token)
    // Return the admin object if token is valid, otherwise return null or throw an error
    // For simplicity, this example assumes token verification is successful
    return Promise.resolve({ username: 'admin' });
}

module.exports = adminMiddleware;
