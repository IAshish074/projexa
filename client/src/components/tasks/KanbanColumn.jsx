import React from 'react';
import TaskCard from './TaskCard';
import { useProjects } from '../../context/ProjectContext';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ title, status, tasks }) => {
  const { updateTaskStatus } = useProjects();

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="bg-dark-800/30 border border-white/5 rounded-2xl flex flex-col h-full min-h-[500px]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark-800/80 backdrop-blur-md rounded-t-2xl z-10">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white capitalize">{title}</h3>
          <span className="bg-white/10 text-slate-300 text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
