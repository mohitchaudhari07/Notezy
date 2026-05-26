// Load environment variables before anything else
require('dotenv').config();

const app = require('./app');
const connectDB = async () => {
  try {
    const connect = require('./config/db');
    await connect();
  } catch (err) {
    console.error('❌ Mongoose connection script missing or failed:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

// Initialize server boot processes
const startServer = async () => {
  // Connect to DB
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Notezy Backend active in [${process.env.NODE_ENV || 'development'}] mode.`);
    console.log(`📡 Listening on: http://localhost:${PORT}`);
  });
  
  // Clean termination handlers
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('💤 Server process closed.');
      process.exit(0);
    });
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('❌ Server failed to start:', error.message);
  process.exit(1);
});
