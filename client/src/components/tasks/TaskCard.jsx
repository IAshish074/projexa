import React from 'react';
import { Clock, MessageSquare, Paperclip, MoreVertical, Edit2, Trash2, Check } from 'lucide-react';
import { getPriorityColor, formatDate } from '../../utils/helpers';
import { useProjects } from '../../context/ProjectContext';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Upload, Loader2 } from 'lucide-react';

import TaskModal from './TaskModal';

const TaskCard = ({ task }) => {
  const { members, deleteTask, updateTask } = useProjects();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const assignee = task.assignedTo?.name ? task.assignedTo : members.find(m => m._id === task.assignedTo);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  const handleFileUpload = async (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post(`/tasks/${task._id}/upload`, formData);
      toast.success('Task submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload task');
    } finally {
      setUploading(false);
    }
  };

  const handleStatusToggle = async (e) => {
    e.stopPropagation();
    const statusOrder = ['todo', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    
    try {
      await updateTask(task._id, { status: nextStatus });
      toast.success(`Moved to ${nextStatus.replace('-', ' ')}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAcceptTask = async (e) => {
    e.stopPropagation();
    try {
      await api.put(`/tasks/${task._id}/accept`);
      toast.success('Task accepted and moved to in-progress');
    } catch (err) {
      toast.error('Failed to accept task');
    }
  };

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -2 }}
        onClick={() => setIsEditModalOpen(true)}
        className="glass-card p-4 cursor-pointer border-l-4 group relative"
        style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#eab308' : '#3b82f6' }}
        draggable="true"
        onDragStart={(e) => {
          e.dataTransfer.setData('taskId', task._id);
        }}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {user?.role === 'admin' ? (
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <MoreVertical size={14} />
              </button>

              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 mt-1 w-32 bg-dark-800 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {user?.role !== 'admin' && (task.status === 'pending' || task.status === 'todo') && 
             (user?.id === (task.assignedTo?._id || task.assignedTo)) && (
                <button 
                  onClick={handleAcceptTask}
                  className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  Accept Task
                </button>
              )}
              <input 
                type="file" 
                id={`upload-${task._id}`} 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <button 
                onClick={handleStatusToggle}
                className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
                title="Change Status"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={() => document.getElementById(`upload-${task._id}`).click()}
                disabled={uploading}
                className="text-slate-400 hover:text-primary-400 transition-colors p-1"
                title="Submit Work"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <div className="flex -space-x-2">
            {assignee && (
              <img 
                src={assignee.avatar} 
                alt={assignee.name} 
                className="w-6 h-6 rounded-full border border-dark-800"
                title={assignee.name}
              />
            )}
          </div>
        </div>
        
        <h4 className="text-white font-medium mb-2 leading-tight">{task.title}</h4>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><MessageSquare size={12} /> 2</span>
            <span className="flex items-center gap-1"><Paperclip size={12} /> 1</span>
          </div>
        </div>
      </motion.div>

      <TaskModal 
        isOpen={isEditModalOpen}
        onClose={(e) => {
          if (e) e.stopPropagation();
          setIsEditModalOpen(false);
        }}
        task={task}
      />
    </>
  );
};

export default TaskCard;
