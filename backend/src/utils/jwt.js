const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'fallbacksecretkey',
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '1d'
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id
    },
    process.env.JWT_SECRET || 'fallbacksecretkey',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
