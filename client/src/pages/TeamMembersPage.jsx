import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import Button from '../components/common/Button';
import { Search, Mail, UserPlus, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import InviteModal from '../components/team/InviteModal';

const TeamMembersPage = () => {
  const { members = [] } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button 
            className="shrink-0"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} className="mr-1" /> Invite Member
          </Button>
        </div>
      </div>

      <InviteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, index) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="glass-card p-6 flex flex-col items-center text-center relative group"
          >
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={18} />
            </button>
            
            <div className="relative mb-4">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-20 h-20 rounded-full border-4 border-dark-800"
              />
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-dark-800 ${
                member.status === 'online' ? 'bg-emerald-500' : 
                member.status === 'away' ? 'bg-yellow-500' : 'bg-slate-500'
              }`}></span>
            </div>
            
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-primary-400 font-medium mb-1">{member.role}</p>
            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
              <Mail size={12} /> {member.email}
            </p>
            
            <div className="w-full mt-auto flex gap-2">
              <Button variant="secondary" className="flex-1 py-1.5 text-xs">Profile</Button>
              <Button variant="ghost" className="flex-1 py-1.5 text-xs bg-white/5 border border-transparent">Message</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembersPage;
