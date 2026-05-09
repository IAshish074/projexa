const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

// Connect Database
connectDB();

const PORT = process.env.PORT || 8080;

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running...',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Initialize socket
initSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});