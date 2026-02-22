import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const Atmosphere: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const x1 = useTransform(springX, [-0.5, 0.5], [-60, 60]);
  const y1 = useTransform(springY, [-0.5, 0.5], [-60, 60]);
  const x2 = useTransform(springX, [-0.5, 0.5], [40, -40]);
  const y2 = useTransform(springY, [-0.5, 0.5], [40, -40]);
  const x3 = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const y3 = useTransform(springY, [-0.5, 0.5], [50, -50]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div 
        style={{ x: x1, y: y1 }} 
        className="atmosphere-blob bg-teal-100 w-[500px] h-[500px] -top-24 -left-24 animate-float absolute" 
      />
      <motion.div 
        style={{ x: x2, y: y2 }} 
        className="atmosphere-blob bg-emerald-50 w-[400px] h-[400px] top-1/2 -right-24 animate-float absolute" 
        transition={{ delay: 2 }}
      />
      <motion.div 
        style={{ x: x3, y: y3 }} 
        className="atmosphere-blob bg-teal-50 w-[300px] h-[300px] bottom-0 left-1/4 animate-float absolute" 
        transition={{ delay: 4 }}
      />
    </div>
  );
};

export const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full mb-8 md:mb-12 relative">
      <div className="flex justify-between items-end mb-3">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-teal-petroleum/40">Progresso da Triagem</span>
        <span className="text-xs font-mono font-bold text-teal-petroleum">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-teal-900/5 h-1.5 rounded-full overflow-hidden relative">
        <motion.div 
          className="progress-gradient h-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brilho na ponta */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm" />
        </motion.div>
      </div>
    </div>
  );
};
