const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/error.middleware');
const ApiError = require('./utils/ApiError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});



// Standard premium middlewares
app.use(cors(corsOptions));
app.use(limiter);
app.use(compression()); // Enable gzip compression for responses
app.use(helmet()); // Set security-related HTTP headers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// Setup cookie parsing if needed (we check headers mainly, cookies as fallback)
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Base health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), message: 'Server is healthy' });
});

// Import route files
const authRoutes = require('./routes/auth.routes');
const resourceRoutes = require('./routes/resource.routes');
const aiRoutes = require('./routes/ai.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const enquiryRoutes = require('./routes/enquiry.routes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enquiry', enquiryRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notezy API is running",
    environment: process.env.NODE_ENV,
  });
});

// Handle unknown route hits (404)
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Mount global error handler
app.use(errorHandler);

module.exports = app;
