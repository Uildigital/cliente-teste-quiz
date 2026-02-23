import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ShieldCheck, Target, Heart, UserPlus } from 'lucide-react';
import { Button } from '../ui/Buttons';
import { CONFIG } from '../../config';
import { formatWebhookPayload } from '../../utils/webhook';
import { TriageFormData } from '../../types/triage';

export const WelcomeStep: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-10 py-4 md:py-8"
  >
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
      <div className="relative group shrink-0">
        <div className="absolute -inset-4 bg-teal-100/50 rounded-[2.5rem] blur-2xl group-hover:bg-teal-200/50 transition-all duration-500" />
        <div className="w-48 h-48 md:w-64 md:h-64 relative">
          <img 
            src={CONFIG.PSICOLOGO_FOTO_URL} 
            alt={CONFIG.PSICOLOGO_NOME}
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl border-8 border-white relative z-10"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div className="text-center md:text-left space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-black text-teal-petroleum/40">Agenda Blindada • Luxo</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-professional leading-tight">
            {CONFIG.PSICOLOGO_NOME} <br />
            <span className="text-teal-petroleum text-xl sm:text-2xl md:text-3xl font-medium">{CONFIG.PSICOLOGO_ESPECIALIDADE}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">{CONFIG.PSICOLOGO_CRP}</p>
        </div>
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-medium max-w-xl">
          Bem-vindo ao seu espaço de cuidado e transformação. Inicie sua jornada com uma triagem especializada focada em seus objetivos.
        </p>
      </div>
    </div>

    <div className="w-full space-y-8">
      <div className="bg-teal-50/50 p-5 sm:p-6 md:p-8 rounded-3xl border border-teal-100">
        <h3 className="text-lg sm:text-xl font-bold text-teal-professional mb-4">Sobre a Metodologia</h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Trabalho com a <span className="font-bold text-teal-petroleum">Terapia Cognitivo-Comportamental (TCC)</span>, uma abordagem científica focada na reestruturação de pensamentos disfuncionais e no estabelecimento de metas práticas para resultados duradouros na sua saúde mental.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: 'Acolhimento Ético', desc: 'Sigilo absoluto e respeito total.' },
          { icon: Target, title: 'Foco na Solução', desc: 'Estratégias práticas e metas claras.' },
          { icon: Heart, title: 'Cuidado Individual', desc: 'Plano terapêutico personalizado.' }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center gap-3"
          >
            <div className="p-3 bg-teal-50 rounded-xl text-teal-petroleum">
              <card.icon size={24} />
            </div>
            <h4 className="font-bold text-teal-professional">{card.title}</h4>
            <p className="text-xs text-gray-400">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>

    <Button onClick={onStart} className="w-full md:w-auto text-xl py-6 px-12">
      Iniciar Triagem Especializada <ArrowRight size={24} className="animate-pulse" />
    </Button>
  </motion.div>
);

export const SuccessStep: React.FC<{ formData: TriageFormData; onReset: () => void }> = ({ formData, onReset }) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveContact = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    // Removido o envio de evento aqui para evitar duplicidade no Fiqon/Z-API
    // O evento principal já é enviado ao completar o quiz.

    const message = encodeURIComponent(`Olá ${CONFIG.PSICOLOGO_NOME}, acabei de preencher a triagem e salvei seu contato para receber as opções de horários.`);
    window.open(`https://wa.me/${CONFIG.PSICOLOGO_WHATSAPP}?text=${message}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="text-center py-8 md:py-12 space-y-8"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-4 bg-teal-100 blur-2xl rounded-full opacity-50" 
          />
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-xl relative z-10 border-4 border-teal-50">
            <CheckCircle2 size={64} className="text-teal-petroleum" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-professional">
            Sua jornada começa agora, <span className="text-teal-petroleum">{formData.nome.split(' ')[0]}</span>.
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-600 font-medium">
              Recebi suas informações e elas serão tratadas com o máximo sigilo e cuidado. Iniciarei agora uma análise cuidadosa do seu perfil para garantir que nosso primeiro encontro seja o mais produtivo possível.
            </p>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Para que eu possa te enviar as opções de horários e os próximos passos sem interrupções, é fundamental que você salve meu contato profissional. Clique no botão abaixo para validar nosso vínculo.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-8 pt-4">
        <Button 
          onClick={handleSaveContact} 
          className="w-full md:w-auto text-lg py-6 px-10 bg-gradient-to-r from-teal-petroleum to-teal-professional border-none shadow-xl shadow-teal-900/10"
        >
          <UserPlus size={24} /> Validar Vínculo e Salvar Contato
        </Button>
        
        <div className="space-y-6">
          <p className="text-teal-professional/60 font-medium italic">
            Em breve, entrarei em contato pessoalmente para darmos início à sua transformação.
          </p>
          
          <button 
            onClick={onReset}
            className="text-gray-300 hover:text-teal-petroleum transition-all text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            Reiniciar Triagem
          </button>
        </div>
      </div>
    </motion.div>
  );
};
