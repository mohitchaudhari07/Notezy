const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n🔹 MongoDB Connected: ${connInstance.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
