import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { BarChart, CheckSquare, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { projects = [], tasks = [], members = [], activity = [] } = useProjects();

  const stats = [
    { title: 'Total Projects', value: projects.length, icon: <Briefcase size={24} />, color: 'bg-primary-500/20 text-primary-400' },
    { title: 'Total Tasks', value: tasks.length, icon: <CheckSquare size={24} />, color: 'bg-indigo-500/20 text-indigo-400' },
    { title: 'Team Members', value: members.length, icon: <Users size={24} />, color: 'bg-emerald-500/20 text-emerald-400' },
    { title: 'Completed Tasks', value: tasks.filter(t => t.status === 'completed').length, icon: <BarChart size={24} />, color: 'bg-purple-500/20 text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="text-sm text-slate-400">
          Welcome back to your workspace!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-bold text-white mb-4">Active Projects</h2>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <h4 className="text-white font-medium">{project.title}</h4>
                  <p className="text-sm text-slate-400">{project.description.substring(0, 50)}...</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-dark-900 rounded-full h-2.5 border border-white/10">
                    <div className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-slate-300">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-6">
            {activity.map((act) => (
              <div key={act.id} className="flex gap-4 relative">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <div className="absolute left-1 top-4 bottom-[-16px] w-[1px] bg-white/10 last:hidden" />
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium text-primary-400">{act.user}</span> {act.action} <span className="font-medium">{act.target}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
