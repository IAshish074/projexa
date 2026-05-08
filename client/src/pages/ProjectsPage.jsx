import React from 'react';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/projects/ProjectCard';
import Button from '../components/common/Button';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/projects/ProjectModal';

const ProjectsPage = () => {
  const { projects = [] } = useProjects();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-slate-400">Manage your active and completed projects</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto text-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="glass-input w-full sm:w-64 pl-9 bg-dark-800"
            />
          </div>
          {user?.role === 'admin' && (
            <Button 
              className="shrink-0"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} className="mr-1" /> New Project
            </Button>
          )}
        </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
