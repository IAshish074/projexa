# 🚀 TaskFlow: Premium Project Management Suite

TaskFlow is a high-performance, real-time MERN stack application designed for seamless team collaboration and project tracking. It features a stunning, glassmorphism-inspired UI with robust role-based access control and instant communication capabilities.

---

## ✨ Key Features

### 🏢 Project & Team Management
- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for **Admins** and **Members**.
- **Admin Power**: Create, edit, and delete projects; manage team members; assign tasks.
- **Member Focus**: View assigned projects, track personal tasks, and update work status.

### ⚡ Real-Time Collaboration
- **Team Broadcasts**: Admins can send real-time announcements to entire project teams.
- **Socket.io Integration**: Instant message delivery, task updates, and notifications without page refreshes.
- **Private Messaging**: One-on-one secure chat between team members.

### 📊 Task Tracking & Workflow
- **Kanban-Style Logic**: Tasks move through statuses: `Pending` → `To Do` → `In Progress` → `Completed`.
- **Task Acceptance**: Members can "Accept" assigned tasks, automatically moving them to in-progress.
- **Progress Visualization**: Automatic calculation of project completion percentage based on task status.

### 🖼️ Premium Media Handling
- **ImageKit Integration**: Production-ready file uploads for profile pictures and task submissions.
- **Secure Storage**: All assets are managed through a professional CDN for high performance.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Framer Motion, Lucide Icons, React Toastify |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Real-time** | Socket.io |
| **Media** | ImageKit.io |
| **Auth** | JWT (JSON Web Tokens), Bcryptjs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- ImageKit.io Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL=your_url_endpoint
   ```
   Start the server:
   ```bash
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   ```
   Start the client:
   ```bash
   npm run dev
   ```

---

## 👥 Role Definitions

### 👑 Admin
- Full CRUD access to Projects and Tasks.
- Can invite/manage all users.
- Access to high-level analytics and dashboard.
- Can send Team Broadcast messages.

### 👤 Member
- Read-only access to overall project lists.
- Full access to assigned tasks.
- Can update Task/Project status.
- Can submit work via file uploads.
- Can communicate with team members.

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
# projexa
