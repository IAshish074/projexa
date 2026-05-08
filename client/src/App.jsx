import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { SocketProvider } from './context/SocketContext';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import TaskBoardPage from './pages/TaskBoardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TeamMembersPage from './pages/TeamMembersPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <ProjectProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
                
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                  <Route path="/tasks" element={<TaskBoardPage />} />
                  <Route path="/team" element={<TeamMembersPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/settings" element={<ProfileSettingsPage />} />
                </Route>
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <ToastContainer position="top-right" theme="dark" />
            </MainLayout>
          </ProjectProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
