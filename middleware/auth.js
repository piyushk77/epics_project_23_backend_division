const secretKey = process.env.JWT_SECRET_KEY;

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(205).json({ message: 'Authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(206).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
