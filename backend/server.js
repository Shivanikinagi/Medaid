import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRoutes from './routes/userRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Import services
import { healthCheck } from './services/medicalAnalysisService.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pythonServiceHealthy = await healthCheck();
    
    const databaseStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'disconnected';
    const databaseMessage = mongoose.connection.readyState === 1 
      ? 'Connected to MongoDB' 
      : 'Not connected to MongoDB (check Atlas IP whitelist)';
    
    res.status(200).json({ 
      message: 'MedAid Backend is running!', 
      timestamp: new Date().toISOString(),
      services: {
        backend: 'healthy',
        database: databaseStatus,
        databaseMessage: databaseMessage,
        pythonService: pythonServiceHealthy ? 'healthy' : 'unhealthy'
      },
      notes: databaseStatus === 'disconnected' 
        ? 'Some features may be limited until MongoDB connection is established' 
        : 'All services operational'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking health status', 
      error: error.message 
    });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medaid', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.error('Please check your MongoDB Atlas IP whitelist configuration at: https://cloud.mongodb.com/');
  console.error('For development, you can temporarily add your current IP or 0.0.0.0/0 to the whitelist.');
  // Don't exit the process, allow the server to start without DB connection
  // process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Note: Some features may be limited without MongoDB connection`);
});