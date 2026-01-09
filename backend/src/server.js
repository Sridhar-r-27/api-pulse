// backend/src/server.js
// Updated version with MongoDB connection

// Step 1: Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection function
const connectDB = require('./config/database');

// Import routes
const apiTestRoutes = require('./routes/apiTestRoutes');
const schedulerRoutes = require('./routes/schedulerRoutes');

// Import scheduler
const { startScheduler } = require('./services/schedulerService');

// Step 2: Create Express app
const app = express();

// Step 3: Get port from environment
const PORT = process.env.PORT || 5000;

// Step 4: Middleware
app.use(express.json());
app.use(cors());

// Step 5: Connect to MongoDB
connectDB();

// Step 6: Start API monitoring scheduler
// This will test APIs automatically every 5 minutes
startScheduler();

// Step 7: API Routes - mount the routes
app.use('/api', apiTestRoutes);
app.use('/api/scheduler', schedulerRoutes);

// Step 8: Basic Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to API Pulse! 🚀',
    status: 'Server is running',
    database: 'Connected to MongoDB',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Step 9: Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔥 Press CTRL+C to stop the server`);
});

// Step 10: Error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

/*
WHAT'S NEW:

1. connectDB() - Calls our database connection function
2. Database status in responses - Shows if MongoDB is connected
3. Better error handling - Exits gracefully on connection failure

WHAT HAPPENS NOW:
1. Server starts
2. Immediately tries to connect to MongoDB
3. Shows success/failure message
4. Your API endpoints now have database access!
*/