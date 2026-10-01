require('dotenv').config({ path: require('path').resolve(__dirname, '.env.local') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const waterBodyRoutes = require('./routes/waterBodies');
const surveyRoutes = require('./routes/surveys');
const waterQualityRoutes = require('./routes/waterQuality');
const alertRoutes = require('./routes/alerts');
const citizenReportRoutes = require('./routes/citizenReports');
const dashboardRoutes = require('./routes/dashboard');
const heatmapRoutes = require("./routes/heatmap");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalrakshak', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/waterbodies', waterBodyRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/waterquality', waterQualityRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/citizen-reports', citizenReportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/heatmap", heatmapRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'JalRakshak API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
