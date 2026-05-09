const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://satisfied-healing-production-27e1.up.railway.app',
        'https://projexa-production-65bd.up.railway.app',
        process.env.CLIENT_URL
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project room: ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
