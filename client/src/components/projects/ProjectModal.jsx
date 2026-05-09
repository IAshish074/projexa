import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProjectModal = ({ isOpen, onClose, project = null }) => {
  const { addProject, updateProject, members } = useProjects();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isOwner =
    project?.createdBy?._id?.toString() === (user?.id || user?._id)?.toString() ||
    project?.createdBy?.toString() === (user?.id || user?._id)?.toString();
  const canEditAll = isOwner || isAdmin;

  const getInitialFormData = (proj) => ({
    title: proj?.title || '',
    description: proj?.description || '',
    status: proj?.status || 'planning',
    deadline: proj?.deadline ? new Date(proj.deadline).toISOString().split('T')[0] : '',
    teamMembers: proj?.teamMembers?.map(m => typeof m === 'object' ? m._id : m) || []
  });

  const [formData, setFormData] = useState(() => getInitialFormData(project));

  // Re-initialize form when the project prop changes
  useEffect(() => {
    setFormData(getInitialFormData(project));
  }, [project?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        await updateProject(project._id, formData);
        toast.success('Project updated successfully');
      } else {
        await addProject(formData);
        toast.success('Project created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Title</label>
          <input
            type="text"
            required
            className="glass-input w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Website Redesign"
            disabled={!canEditAll}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea
            className="glass-input w-full min-h-[100px] py-3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the project goals..."
            disabled={!canEditAll}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Deadline</label>
          <input
            type="date"
            required
            className="glass-input w-full"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            disabled={!canEditAll}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
          <select
            className="glass-input w-full appearance-none"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Assign Team Members</label>
          <div className={`grid grid-cols-2 gap-3 max-h-[150px] overflow-y-auto custom-scrollbar p-1 ${!canEditAll ? 'opacity-50 pointer-events-none' : ''}`}>
            {members.map(member => (
              <div
                key={member._id}
                onClick={() => canEditAll && toggleMember(member._id)}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all
                  ${formData.teamMembers.includes(member._id)
                    ? 'bg-primary-500/10 border-primary-500/50 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}
                  ${!canEditAll ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <img src={member.avatar} className="w-6 h-6 rounded-full" alt={member.name} />
                <span className="text-xs truncate">{member.name}</span>
              </div>
            ))}
          </div>
        </div>

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
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={loading}
          >
            {project ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
