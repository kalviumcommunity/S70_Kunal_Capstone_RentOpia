import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 6, type = 'card' }) => {
  const pulse = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      background: [
        'var(--border-alpha)',
        'var(--bg-card)',
        'var(--border-alpha)'
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'details') {
    return (
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          <motion.div {...pulse} className="aspect-square rounded-[2rem] border border-[var(--border-alpha)] transition-colors duration-500" />
          <div className="grid grid-cols-2 gap-4">
            <motion.div {...pulse} className="h-20 rounded-2xl border border-[var(--border-alpha)] transition-colors duration-500" />
            <motion.div {...pulse} className="h-20 rounded-2xl border border-[var(--border-alpha)] transition-colors duration-500" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <motion.div {...pulse} className="h-4 w-20 rounded-full" />
            <motion.div {...pulse} className="h-16 w-full rounded-2xl" />
            <motion.div {...pulse} className="h-4 w-1/3 rounded-full" />
          </div>
          <motion.div {...pulse} className="h-64 w-full rounded-[2.5rem] border border-[var(--border-alpha)] transition-colors duration-500" />
          <div className="space-y-4">
             <motion.div {...pulse} className="h-4 w-1/4 rounded-full" />
             <motion.div {...pulse} className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Default: Grid Cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass rounded-3xl overflow-hidden p-6 space-y-4 shadow-2xl transition-colors duration-500">
          <motion.div 
            {...pulse}
            className="h-48 rounded-2xl border border-[var(--border-alpha)]"
          />
          <div className="space-y-3">
            <motion.div {...pulse} className="h-6 w-3/4 rounded-lg" />
            <motion.div {...pulse} className="h-4 w-1/2 rounded-lg opacity-50" />
          </div>
          <div className="pt-4 border-t border-[var(--border-alpha)] flex justify-between items-center">
            <div className="space-y-2">
              <motion.div {...pulse} className="h-2 w-12 rounded" />
              <motion.div {...pulse} className="h-8 w-24 rounded-lg" />
            </div>
            <motion.div {...pulse} className="w-12 h-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
