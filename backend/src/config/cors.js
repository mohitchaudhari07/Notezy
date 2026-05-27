const corsOptions = {
  origin: (origin, callback) => {
    // Permitted origins from env, production frontend, and local dev servers
    const allowedOrigins = [
      process.env.CLIENT_URL || 'https://notezy1.onrender.com',
      'https://notezy1.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    
    // In development mode, allow requests with no origin (like mobile apps, postman, curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
