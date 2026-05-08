import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useProjects } from '../../context/ProjectContext';
import { toast } from 'react-toastify';
import { Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TaskModal = ({ isOpen, onClose, task = null, initialStatus = 'todo' }) => {
  const { addTask, updateTask, projects, members } = useProjects();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === 'admin';
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || initialStatus,
    priority: task?.priority || 'medium',
    projectId: task?.project?._id || task?.project || (projects.length > 0 ? projects[0]._id : ''),
    assignedTo: task?.assignedTo?._id || task?.assignedTo || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }
    setLoading(true);
    try {
      if (task) {
        // For simplicity in this demo, updateTaskStatus is actually an updateTask call
        await updateTask(task._id, formData);
        toast.success('Task updated successfully');
      } else {
        await addTask(formData.projectId, formData);
        toast.success('Task created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Task Title</label>
          <input
            type="text"
            required
            className="glass-input w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Design Landing Page"
            disabled={!isAdmin}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Project</label>
          <select
            className="glass-input w-full appearance-none"
            required
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            disabled={!isAdmin}
          >
            <option value="" disabled>Select a project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select
              className="glass-input w-full appearance-none"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
            <select
              className="glass-input w-full appearance-none"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              disabled={!isAdmin}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Assign To</label>
          <select
            className="glass-input w-full appearance-none"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            disabled={!isAdmin}
          >
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
          <input
            type="date"
            className="glass-input w-full"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            disabled={!isAdmin}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea
            className="glass-input w-full min-h-[80px] py-3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What needs to be done?"
            disabled={!isAdmin}
          />
        </div>

        {task?.attachments?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Submitted Work</label>
            <div className="space-y-2">
              {task.attachments.map((url, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-primary-400 hover:bg-white/10 transition-colors"
                >
                  <Paperclip size={14} /> View Submission {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={(e) => {
              if (e) e.stopPropagation();
              onClose();
            }}
          >
            {isAdmin ? 'Cancel' : 'Close'}
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={loading}
          >
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
