import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { ArrowRight, CheckCircle, LayoutDashboard, Users, Zap } from 'lucide-react';

const LandingPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-xl leading-none">P</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              ProManage
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 inline-block">
            Project Management Rethought
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
            Manage your teams with <br className="hidden md:block" />
            <span className="gradient-text">effortless clarity</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            A modern, intuitive project management platform designed for forward-thinking teams. 
            Streamline workflows, track progress, and deliver results faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="py-3 px-8 text-lg w-full sm:w-auto">
                Start for free <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" className="py-3 px-8 text-lg w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>
        </motion.div>
        
        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
          <div className="glass-card rounded-t-2xl border-b-0 overflow-hidden shadow-2xl p-2 relative max-w-4xl mx-auto">
             <div className="bg-dark-800 rounded-t-xl overflow-hidden border border-white/5 aspect-video flex flex-col">
               {/* Browser bar mockup */}
               <div className="bg-dark-900 border-b border-white/5 py-2 px-4 flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
               </div>
               <div className="flex-1 p-6 flex flex-col gap-4">
                 <div className="w-48 h-6 bg-white/5 rounded-md animate-pulse"></div>
                 <div className="grid grid-cols-3 gap-4">
                   <div className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
                   <div className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
                   <div className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
                 </div>
                 <div className="flex-1 flex gap-4 mt-4">
                   <div className="w-64 h-full bg-white/5 rounded-lg animate-pulse"></div>
                   <div className="flex-1 h-full bg-white/5 rounded-lg animate-pulse"></div>
                 </div>
               </div>
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
