import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MoreVertical, CheckSquare, Edit2, Trash2 } from 'lucide-react';
import { getStatusColor, formatDate } from '../../utils/helpers';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

import ProjectModal from './ProjectModal';

const ProjectCard = ({ project }) => {
  const { deleteProject } = useProjects();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  
  const isOwner = project.createdBy?._id === user?.id || project.createdBy === user?.id;
  const isAdmin = user?.role === 'admin';
  const isMember = project.teamMembers?.some(m => (m._id || m) === user?.id);

  // Use backend properties
  const projectMembers = project.teamMembers || [];
  const projectTasks = project.tasks || [];
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(project._id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="relative">
          {(isOwner || isAdmin || isMember) && (
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <MoreVertical size={18} />
            </button>
          )}

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-36 bg-dark-800 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                {(isOwner || isAdmin || isMember) && (
                  <button 
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} /> {isOwner || isAdmin ? 'Edit' : 'Update Status'}
                  </button>
                )}
                {(isOwner || isAdmin) && (
                  <button 
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
      />

      <div className="mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(project.status)}`}>
          {project.status.replace('-', ' ')}
        </span>
      </div>

      <Link to={`/projects/${project._id}`}>
        <h3 className="text-xl font-bold text-white mb-2 hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
      </Link>
      
      <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
        {project.description}
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-dark-900 rounded-full h-2 border border-white/5">
            <div 
              className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2 rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex -space-x-2">
            {projectMembers.map((member, i) => (
              <img 
                key={member._id || member}
                src={member.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                alt={member.name || 'User'} 
                className="w-8 h-8 rounded-full border-2 border-dark-800"
                style={{ zIndex: projectMembers.length - i }}
                title={member.name || 'User'}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1" title="Tasks">
              <CheckSquare size={14} />
              <span>{completedTasks}/{projectTasks.length}</span>
            </div>
            <div className="flex items-center gap-1" title="Due Date">
              <Calendar size={14} />
              <span>{formatDate(project.deadline)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
