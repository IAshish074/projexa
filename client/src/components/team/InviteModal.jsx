import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { Mail, Shield } from 'lucide-react';

import api from '../../utils/api';

const InviteModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'member'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/invite', formData);
      toast.success(`Invitation sent to ${formData.email}`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
    >
      <p className="text-sm text-slate-400 mb-6">
        Enter the email address of the person you'd like to invite to your workspace.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              required
              className="glass-input w-full pl-10"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="colleague@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5 font-medium">Workspace Role</label>
          <div className="grid grid-cols-2 gap-3">
            {['member', 'admin'].map((role) => (
              <div
                key={role}
                onClick={() => setFormData({ ...formData, role })}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                  ${formData.role === role
                    ? 'bg-primary-500/10 border-primary-500/50 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                <Shield size={16} />
                <span className="text-sm capitalize">{role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={loading}
          >
            Send Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteModal;
