# TaskFlow Backend 🚀

The core API and real-time engine for TaskFlow, built with Node.js, Express, and Socket.io.

## 🏗️ Architecture
- **API**: RESTful architecture with structured error handling.
- **Real-time**: Event-driven communication using Socket.io rooms.
- **Database**: Document-oriented storage with Mongoose ODM.
- **Storage**: Media management via ImageKit API.

## 🔐 Security Features
- JWT-based authentication with cookie-parser.
- Role-Based Access Control (RBAC) middleware.
- Request validation using express-validator.
- Password hashing with Bcrypt.
- CORS protection.

## 📂 Project Structure
- `/controllers`: Request handlers and business logic.
- `/models`: Mongoose schemas and database logic.
- `/routers`: API route definitions.
- `/middlewares`: Auth, error handling, and validation layers.
- `/utils`: Helper functions for Socket.io, ImageKit, and email.

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - New user signup
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get profile

### Messaging
- `GET /api/messages` - Fetch private and team chats
- `POST /api/messages` - Send message (Recipient ID or Project ID)

### Projects & Tasks
- `GET /api/projects` - List projects (Role filtered)
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/tasks/:id/accept` - Member task acceptance
- `POST /api/tasks/:id/upload` - Submit work (ImageKit)

---

## 🛠️ Setup
1. `npm install`
2. Configure `.env`
3. `npm run dev` (Nodemon) or `npm start` (Production)
