const dotenv = require('dotenv');

// Load env vars before loading app
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Initialize Socket.io
initSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
