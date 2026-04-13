const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: './.env' });

console.log("ENV CHECK:", process.env.MONGODB_URI);
console.log('--- ACTUAL DB URI:', process.env.MONGODB_URI);
// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/candidate', require('./routes/candidate'));
app.use('/api/hr', require('./routes/hr'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartRecruit API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SmartRecruit API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      candidate: '/api/candidate',
      hr: '/api/hr'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ========================================
  🚀 SmartRecruit Server Running
  ========================================
  Environment: ${process.env.NODE_ENV || 'development'}
  Port: ${PORT}
  Database: ${process.env.MONGODB_URI}
  ========================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
