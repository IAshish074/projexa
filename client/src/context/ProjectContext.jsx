import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const location = useLocation();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('task-created', (task) => {
        setTasks(prev => [...prev, task]);
        fetchDashboardData();
      });

      socket.on('task-updated', (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        fetchDashboardData();
      });

      // Real-time role update
      socket.on('role-updated', ({ userId, newRole }) => {
        setMembers(prev =>
          prev.map(m => (m._id || m.id) === userId ? { ...m, role: newRole } : m)
        );
      });

      projects.forEach(p => {
        socket.emit('join-project', p._id);
      });

      return () => {
        socket.off('task-created');
        socket.off('task-updated');
        socket.off('role-updated');
      };
    }
  }, [socket, projects]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, location.pathname]);

  useEffect(() => {
    let interval;
    if (user) {
     
      interval = setInterval(fetchDashboardData, 30000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      
      const [projectsRes, tasksRes, membersRes, statsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/users'),
        user.role === 'admin' ? api.get('/dashboard/admin') : api.get('/dashboard/member')
      ]);

      setProjects(projectsRes.data.data);
      setTasks(tasksRes.data.data);
      setMembers(membersRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData) => {
    try {
      const res = await api.post('/projects', projectData);
      setProjects([...projects, res.data.data]);
      toast.success('Project created successfully');
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create project';
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateProject = async (id, updatedData) => {
    try {
      const res = await api.put(`/projects/${id}`, updatedData);
      setProjects(projects.map(p => p._id === id ? res.data.data : p));
      toast.success('Project updated');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update project';
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete project';
      toast.error(errorMsg);
      throw err;
    }
  };

  const addTask = async (projectId, taskData) => {
    try {
      const res = await api.post(`/projects/${projectId}/tasks`, taskData);
      setTasks([...tasks, res.data.data]);
      
     
      fetchDashboardData(); 
      toast.success('Task created successfully');
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create task';
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, updatedData);
      setTasks(tasks.map(t => t._id === taskId ? res.data.data : t));
     
      if (updatedData.status) {
        api.get('/projects').then(res => setProjects(res.data.data));
      }
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update task';
      toast.error(errorMsg);
      throw err;
    }
  };
  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete task';
      toast.error(errorMsg);
      throw err;
    }
  };

  const value = {
    projects,
    tasks,
    members,
    setMembers,
    stats,
    activity: [],
    loading,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    refreshData: fetchDashboardData
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
