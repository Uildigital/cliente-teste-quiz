import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = "", 
  ...props 
}) => {
  const variants = {
    primary: "bg-teal-petroleum text-white hover:bg-teal-professional shadow-lg hover:shadow-teal-petroleum/20",
    secondary: "bg-teal-professional text-white hover:bg-teal-900",
    outline: "border-2 border-teal-petroleum/20 text-teal-petroleum hover:bg-teal-50 hover:border-teal-petroleum/40"
  };

  return (
    <button 
      className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  index?: number;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ selected, onClick, children, index = 0 }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 sm:p-6 rounded-2xl border-2 text-left transition-all group relative overflow-hidden ${
      selected 
        ? 'border-teal-petroleum bg-white text-teal-professional shadow-xl shadow-emerald-100' 
        : 'border-white/60 hover:border-teal-200 bg-white shadow-sm hover:shadow-md'
    }`}
  >
    {selected && <motion.div layoutId="active-bg" className="absolute inset-0 bg-teal-50/20 -z-10" />}
    <div className="flex items-center justify-between gap-4">
      <span className={`font-medium text-base sm:text-lg ${selected ? 'text-teal-professional font-bold' : 'text-gray-600'}`}>{children}</span>
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-petroleum flex items-center justify-center text-white shrink-0"
          >
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.button>
);
