// backend/src/config/database.js
// This file handles the connection to MongoDB

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    // Attempt to connect
    console.log('🔄 Connecting to MongoDB...');
    
    // No options needed in newer Mongoose versions
    const conn = await mongoose.connect(mongoURI);

    // Success message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

  } catch (error) {
    // If connection fails, show error and exit
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit with failure
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

// Export the function so we can use it in server.js
module.exports = connectDB;

/*
EXPLANATION:

1. mongoose.connect() - Connects to MongoDB using the URI from .env
2. async/await - Waits for connection before moving forward
3. try/catch - Handles errors gracefully if connection fails
4. Connection events - Monitors connection status in real-time
5. module.exports - Makes this function available to other files

WHY THIS MATTERS:
- Separating database logic keeps code organized
- Error handling prevents crashes
- Connection monitoring helps debugging
*/