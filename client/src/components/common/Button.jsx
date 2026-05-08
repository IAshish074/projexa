import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, 
  ...props 
}) => {
  const baseClasses = "flex items-center justify-center font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-500/25 px-4 py-2",
    secondary: "bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 px-4 py-2",
    ghost: "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white px-4 py-2"
  };

  return (
    <motion.button 
      whileTap={!props.disabled && !isLoading ? { scale: 0.95 } : {}}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
