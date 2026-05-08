import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import KanbanColumn from '../components/tasks/KanbanColumn';
import Button from '../components/common/Button';
import { Plus, Filter } from 'lucide-react';
import TaskModal from '../components/tasks/TaskModal';
import { motion } from 'framer-motion';

const TaskBoardPage = () => {
  const { tasks = [], projects = [] } = useProjects();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'pending', title: 'Pending Acceptance' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
  ];

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => (t.project?._id || t.project) === filter);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Board</h1>
          <p className="text-sm text-slate-400">Manage and track your tasks</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto text-sm">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              className="glass-input w-full sm:w-48 pl-9 appearance-none bg-dark-800"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          {user?.role === 'admin' && (
            <Button 
              className="shrink-0"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} className="mr-1" /> New Task
            </Button>
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-[800px]">
          {columns.map(column => (
            <div key={column.id} className="w-1/4 min-w-[280px]">
              <KanbanColumn 
                title={column.title} 
                status={column.id} 
                tasks={filteredTasks.filter(t => t.status === column.id)} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskBoardPage;
