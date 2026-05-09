const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const errorHandler = require('./middlewares/error');

const authRoutes = require('./routers/authRouter');
const userRoutes = require('./routers/userRouter');
const projectRoutes = require('./routers/projectRouter');
const taskRoutes = require('./routers/taskRouter');
const dashboardRoutes = require('./routers/dashboardRouter');
const messageRoutes = require('./routers/messageRouter');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://projexa-1pmb.vercel.app',
  'https://projexa-production-65bd.up.railway.app',
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow if in allowedOrigins list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow all vercel.app and railway.app subdomains in production
    if (origin.endsWith('.vercel.app') || origin.endsWith('.up.railway.app')) {
      return callback(null, true);
    }

    // Allow everything in non-production
    if (process.env.NODE_ENV !== 'production') return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server healthy',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running...',
  });
});

// Error Handler
app.use(errorHandler);

module.exports = app;