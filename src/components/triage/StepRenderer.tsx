import React from 'react';
import { motion } from 'motion/react';
import { TriageStep, TriageFormData } from '../../types/triage';
import { OptionButton } from '../ui/Buttons';
import { formatPhone } from '../../utils/formatters';

interface StepRendererProps {
  step: TriageStep;
  formData: TriageFormData;
  onUpdate: (field: keyof TriageFormData, value: string) => void;
}

export const StepRenderer: React.FC<StepRendererProps> = ({ step, formData, onUpdate }) => {
  const Icon = step.icon;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate('whatsapp', formatPhone(e.target.value));
  };

  return (
    <motion.div 
      key={step.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-10"
    >
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-teal-professional flex items-center gap-4">
          <div className="p-3 bg-teal-petroleum/10 rounded-2xl text-teal-petroleum">
            <Icon size={32} />
          </div>
          {step.title}
        </h2>
        <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl leading-relaxed">{step.description}</p>
      </div>

      <div className="space-y-6">
        {step.type === 'text' && (
          <div className="group">
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">Nome Completo</label>
            <input 
              type="text"
              placeholder="Seu nome aqui"
              className="w-full p-4 sm:p-5 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:border-teal-petroleum focus:ring-4 focus:ring-teal-petroleum/5 outline-none transition-all text-base sm:text-lg"
              value={formData.nome}
              onChange={(e) => onUpdate('nome', e.target.value)}
            />
            <div className="mt-6 group">
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">WhatsApp</label>
              <input 
                type="text"
                placeholder="(00) 00000-0000"
                className="w-full p-4 sm:p-5 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:border-teal-petroleum focus:ring-4 focus:ring-teal-petroleum/5 outline-none transition-all text-base sm:text-lg"
                value={formData.whatsapp}
                onChange={handlePhoneChange}
              />
            </div>
          </div>
        )}

        {step.type === 'scale' && (
          <div className="space-y-8 py-4">
            <div className="grid grid-cols-5 sm:flex sm:justify-between gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdate(step.field, num.toString())}
                  className={`h-12 sm:flex-1 sm:h-16 rounded-xl border-2 transition-all font-bold text-base sm:text-lg flex items-center justify-center ${
                    formData[step.field] === num.toString()
                      ? 'bg-teal-petroleum border-teal-petroleum text-white shadow-lg scale-110 z-10'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-teal-200 hover:text-teal-petroleum'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs uppercase tracking-widest font-bold text-gray-400 px-1">
              <span>Leve</span>
              <span>Moderado</span>
              <span>Intenso</span>
            </div>
            <div className="relative h-3 w-full bg-gray-100/50 rounded-full p-0.5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-teal-500 to-teal-900 opacity-20" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(Number(formData[step.field]) || 0) * 10}%` }}
                className="h-full bg-gradient-to-r from-teal-200 via-teal-500 to-teal-900 rounded-full relative z-10 shadow-[0_0_10px_rgba(13,148,136,0.3)]"
              />
            </div>
          </div>
        )}

        {step.type === 'select' && step.options && (
          <div className="space-y-6">
            <div className={`grid gap-4 ${step.options.length > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {step.options.map((option, i) => (
                <OptionButton
                  key={option}
                  index={i}
                  selected={formData[step.field] === option}
                  onClick={() => onUpdate(step.field, option)}
                >
                  {option}
                </OptionButton>
              ))}
            </div>

            {/* Campo condicional para "Outros" no motivo da busca */}
            {step.field === 'motivo' && formData.motivo === 'Outros' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2"
              >
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">Descreva o motivo</label>
                <textarea 
                  placeholder="Conte-nos um pouco mais..."
                  className="w-full p-4 sm:p-5 rounded-2xl border-2 border-gray-100 bg-white/50 focus:bg-white focus:border-teal-petroleum focus:ring-4 focus:ring-teal-petroleum/5 outline-none transition-all text-base sm:text-lg min-h-[120px] resize-none"
                  value={formData.motivo_outro}
                  onChange={(e) => onUpdate('motivo_outro', e.target.value)}
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
