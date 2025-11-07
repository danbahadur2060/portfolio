import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from './Navigation';
import { ScrollProgress } from './ScrollProgress';
import { BackToTop } from './BackToTop';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="pt-16"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      <BackToTop />
    
    </div>
  );
}