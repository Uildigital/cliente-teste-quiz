import { useState, useEffect, useCallback } from 'react';
import { StepId, TriageFormData } from '../types/triage';
import { CONFIG } from '../config';

const STORAGE_KEY_STEP = 'triagem_step';
const STORAGE_KEY_DATA = 'triagem_data';

const initialData: TriageFormData = {
  nome: '',
  whatsapp: '',
  faixa_etaria: '',
  motivo: '',
  motivo_outro: '',
  tempo_convivio: '',
  impacto_rotina: '',
  historico: '',
  modalidade: '',
  filtro_financeiro: '',
  periodo: '',
  comprometimento: ''
};

export const useTriageForm = () => {
  const [step, setStep] = useState<StepId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STEP);
    return (saved && saved !== 'success') ? (isNaN(Number(saved)) ? saved : Number(saved)) as StepId : 'welcome';
  });

  const [formData, setFormData] = useState<TriageFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DATA);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step !== 'success') {
      localStorage.setItem(STORAGE_KEY_STEP, step.toString());
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(formData));
    }
  }, [step, formData]);

  const updateField = useCallback((field: keyof TriageFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const phoneDigits = formData.whatsapp.replace(/[^\d]/g, '');
      // Garante que o telefone comece com 55 se tiver 10 ou 11 dígitos
      const formattedPhone = phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits;

      // Mapeamento explícito para garantir que todos os campos sejam enviados
      const payload = {
        // Identificação
        nome: formData.nome,
        whatsapp: formattedPhone,
        
        // Respostas do Quiz
        faixa_etaria: formData.faixa_etaria,
        motivo_busca: formData.motivo === 'Outros' ? formData.motivo_outro : formData.motivo,
        tempo_convivio: formData.tempo_convivio,
        impacto_na_rotina: formData.impacto_rotina,
        experiencia_anterior: formData.historico,
        modalidade_preferida: formData.modalidade,
        periodo_preferencia: formData.periodo,
        prontidao_mudanca: formData.comprometimento,
        
        // Metadados
        data_envio: now.toLocaleDateString('pt-BR'),
        hora_envio: now.toLocaleTimeString('pt-BR'),
        timestamp: now.toISOString(),
        
        // Objeto completo para redundância
        raw_data: formData
      };

      await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStep('success');
      localStorage.removeItem(STORAGE_KEY_STEP);
      localStorage.removeItem(STORAGE_KEY_DATA);
    } catch (error) {
      console.error('Submission error:', error);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const nextStep = useCallback(() => {
    if (step === 'welcome') {
      setStep(1);
    } else if (typeof step === 'number') {
      if (step < 9) setStep((step + 1) as StepId);
      else submitForm();
    }
  }, [step, submitForm]);

  const prevStep = useCallback(() => {
    if (step === 1) setStep('welcome');
    else if (typeof step === 'number' && step > 1) setStep((step - 1) as StepId);
  }, [step]);

  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_STEP);
    localStorage.removeItem(STORAGE_KEY_DATA);
    setStep('welcome');
    setFormData(initialData);
  }, []);

  const isStepValid = useCallback(() => {
    const phoneDigits = formData.whatsapp.replace(/[^\d]/g, '');
    
    switch (step) {
      case 1: return formData.nome.trim().length >= 3 && phoneDigits.length >= 10;
      case 2: return !!formData.faixa_etaria;
      case 3: 
        if (formData.motivo === 'Outros') return !!formData.motivo_outro.trim();
        return !!formData.motivo;
      case 4: return !!formData.tempo_convivio;
      case 5: return !!formData.impacto_rotina;
      case 6: return !!formData.historico;
      case 7: return !!formData.modalidade;
      case 8: return !!formData.periodo;
      case 9: return !!formData.comprometimento;
      default: return true;
    }
  }, [step, formData]);

  return {
    step,
    formData,
    isSubmitting,
    updateField,
    nextStep,
    prevStep,
    resetForm,
    isStepValid
  };
};
