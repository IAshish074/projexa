import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import Button from '../components/common/Button';
import { ArrowLeft, Calendar, Users, CheckSquare, Edit2 } from 'lucide-react';
import { getStatusColor, formatDate } from '../utils/helpers';
import TaskCard from '../components/tasks/TaskCard';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects = [], tasks = [], members = [] } = useProjects();
  
  const project = projects.find(p => p._id === id);
  
  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-white mb-4">Project not found</h2>
        <Link to="/projects">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter(t => (t.project?._id || t.project) === project._id);
  const projectMembers = members.filter(m => project.teamMembers?.includes(m._id) || project.teamMembers?.some(tm => tm._id === m._id));

  return (
    <div className="space-y-6 pb-6">
      <Link to="/projects" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Projects
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-slate-400 max-w-3xl">{project.description}</p>
        </div>
        
        <Button variant="secondary">
          <Edit2 size={16} className="mr-2" /> Edit Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4">Project Tasks Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectTasks.slice(0, 4).map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
            {projectTasks.length === 0 && (
              <div className="text-center py-8 text-slate-500">No tasks created yet.</div>
            )}
            <div className="mt-4 flex justify-center">
              <Link to="/tasks">
                <Button variant="ghost">View Full Task Board</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4">Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Overall Progress</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-dark-900 rounded-full h-2.5 border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">{project.progress}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Calendar size={18} className="text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className="text-sm font-medium">{formatDate(project.deadline || project.dueDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-slate-300">
                <CheckSquare size={18} className="text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500">Tasks</p>
                  <p className="text-sm font-medium">{projectTasks.length} total tasks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={18} /> Team Members
              </h2>
              <span className="bg-white/10 text-slate-300 text-xs px-2 py-0.5 rounded-full">
                {projectMembers.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {projectMembers.map(member => (
                <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-dark-800" />
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
