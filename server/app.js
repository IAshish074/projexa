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


app.use(express.json());


app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',

 
  'https://projexa-2ndeazqnn-iashish074s-projects.vercel.app',
  'https://satisfied-healing-production-27e1.up.railway.app',
  process.env.CLIENT_URL,
].filter(Boolean); 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy"
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);


// Independent deployment: Static serving removed


app.use(errorHandler);

module.exports = app;
