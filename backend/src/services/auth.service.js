const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

class AuthService {
  async registerUser({ name, email, password, university, branch }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }
    
    const user = await User.create({
      name,
      email,
      password,
      university,
      branch
    });
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    user.refreshToken = refreshToken;
    await user.save();
    
    // Do not return password field
    const userResponse = await User.findById(user._id).select('-password -refreshToken');
    
    return { user: userResponse, accessToken, refreshToken };
  }
  
  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    user.refreshToken = refreshToken;
    await user.save();
    
    const userResponse = await User.findById(user._id).select('-password -refreshToken');
    
    return { user: userResponse, accessToken, refreshToken };
  }
  
  async logoutUser(userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1 // Remove the refresh token from db
        }
      },
      { new: true }
    );
  }
  
  async refreshAccessToken(incomingRefreshToken) {
    try {
      const decodedToken = verifyToken(incomingRefreshToken);
      if (!decodedToken) {
        throw new ApiError(401, "Invalid refresh token");
      }
      
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }
      
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }
      
      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      
      user.refreshToken = newRefreshToken;
      await user.save();
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  }
}

module.exports = new AuthService();
