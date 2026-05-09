import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Search, Mail, UserPlus, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import InviteModal from '../components/team/InviteModal';
import api from '../utils/api';
import { toast } from 'react-toastify';

const TeamMembersPage = () => {
  const { members = [], setMembers } = useProjects();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleToggle = async (member) => {
    const newRole = member.role === 'admin' ? 'member' : 'admin';
    setLoadingId(member._id || member.id);
    try {
      const res = await api.patch(`/users/${member._id || member.id}/role`, { role: newRole });
      toast.success(`${member.name} is now ${newRole}`);
      // Update local state
      if (setMembers) {
        setMembers(prev =>
          prev.map(m =>
            (m._id || m.id) === (member._id || member.id)
              ? { ...m, role: newRole }
              : m
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update role');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-sm text-slate-400">Manage your team and their roles</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto text-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full sm:w-64 pl-9 bg-dark-800"
            />
          </div>
          {currentUser?.role === 'admin' && (
            <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
              <UserPlus size={18} className="mr-1" /> Invite Member
            </Button>
          )}
        </div>
      </div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, index) => {
          const memberId = member._id || member.id;
          const isCurrentUser = memberId === (currentUser?._id || currentUser?.id);
          const isLoading = loadingId === memberId;

          return (
            <motion.div
              key={memberId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="glass-card p-6 flex flex-col items-center text-center relative group"
            >
              {/* Role Badge */}
              <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
                member.role === 'admin'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
              }`}>
                {member.role === 'admin' ? '⚡ Admin' : '👤 Member'}
              </span>

              <div className="relative mb-4 mt-4">
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6d28d9&color=fff`}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-4 border-dark-800"
                />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-dark-800 ${
                  member.status === 'online' ? 'bg-emerald-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-slate-500'
                }`} />
              </div>

              <h3 className="text-lg font-bold text-white">{member.name}</h3>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                <Mail size={12} /> {member.email}
              </p>

              {/* Admin Role Toggle */}
              {currentUser?.role === 'admin' && !isCurrentUser && (
                <button
                  onClick={() => handleRoleToggle(member)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                    member.role === 'admin'
                      ? 'border-slate-600 text-slate-300 hover:border-red-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'border-slate-600 text-slate-300 hover:border-violet-400 hover:text-violet-300 hover:bg-violet-500/10'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-3 w-3 border-t border-white" />
                  ) : member.role === 'admin' ? (
                    <><User size={12} /> Demote to Member</>
                  ) : (
                    <><ShieldCheck size={12} /> Promote to Admin</>
                  )}
                </button>
              )}

              {isCurrentUser && (
                <span className="text-xs text-slate-500 italic">You</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamMembersPage;
