import { useState, useEffect, useCallback } from 'react';
import { StepId, TriageFormData } from '../types/triage';
import { CONFIG } from '../config';
import { TRIAGE_STEPS } from '../constants/triageSteps';
import { formatWebhookPayload } from '../utils/webhook';

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
  const [submitError, setSubmitError] = useState(false);

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
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const payload = formatWebhookPayload(formData, 'quiz_completed');

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
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const nextStep = useCallback(() => {
    if (step === 'welcome') {
      setStep(1);
    } else if (typeof step === 'number') {
      if (step < TRIAGE_STEPS.length) setStep((step + 1) as StepId);
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
    submitError,
    updateField,
    nextStep,
    prevStep,
    resetForm,
    isStepValid
  };
};
