import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  progress?: number;
  index?: number;
}

export function StatCard({ title, value, icon, subtitle, progress, index = 0 }: StatCardProps) {
  return (
    <motion.div 
      className="card-base p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between mb-3">
        <motion.div 
          className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {icon}
        </motion.div>
        <motion.span 
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200 }}
        >
          {value}
        </motion.span>
      </div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="progress-bar">
            <motion.div 
              className="progress-bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
