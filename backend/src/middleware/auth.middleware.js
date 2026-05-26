const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = 
      req.header("Authorization")?.replace("Bearer ", "") || 
      req.cookies?.accessToken;
      
    if (!token) {
      throw new ApiError(401, "Unauthorized request. Missing access token.");
    }
    
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      throw new ApiError(401, "Invalid access token or token expired.");
    }
    
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "User session not found or account disabled.");
    }
    
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

module.exports = verifyJWT;
