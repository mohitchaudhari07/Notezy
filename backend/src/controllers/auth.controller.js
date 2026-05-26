const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, university, branch } = req.body;
  
  const result = await authService.registerUser({
    name,
    email,
    password,
    university,
    branch
  });
  
  // Set refresh token in HTTP-only secure cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  
  return res
    .status(201)
    .json(
      new ApiResponse(
        201, 
        { user: result.user, accessToken: result.accessToken }, 
        'User registered successfully'
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.loginUser({ email, password });
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        { user: result.user, accessToken: result.accessToken }, 
        'User logged in successfully'
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  res.clearCookie('refreshToken', cookieOptions);
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }
  
  const result = await authService.refreshAccessToken(incomingRefreshToken);
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  res.cookie('refreshToken', result.refreshToken, cookieOptions);
  
  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken: result.accessToken }, 'Token refreshed successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user profile fetched successfully'));
});

module.exports = {
  register,
  login,
  logout,
  refresh,
  getMe
};
