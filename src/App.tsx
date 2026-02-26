/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Send } from 'lucide-react';

import { CONFIG } from './config';
import { TRIAGE_STEPS } from './constants/triageSteps';
import { useTriageForm } from './hooks/useTriageForm';

import { Atmosphere, ProgressBar } from './components/ui/Layout';
import { Button } from './components/ui/Buttons';
import { WelcomeStep, SuccessStep } from './components/triage/StaticSteps';
import { StepRenderer } from './components/triage/StepRenderer';

export default function App() {
  const {
    step,
    formData,
    isSubmitting,
    submitError,
    updateField,
    nextStep,
    prevStep,
    resetForm,
    isStepValid
  } = useTriageForm();

  const currentStepData = useMemo(() => 
    typeof step === 'number' ? TRIAGE_STEPS.find(s => s.id === step) : null
  , [step]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 relative">
      <Atmosphere />
      
      <section className="w-full max-w-4xl glass-card rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative">
        <header className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-petroleum/20 via-teal-petroleum to-teal-petroleum/20" />
        
        <div className="p-6 sm:p-8 md:p-16 lg:p-20">
          {typeof step === 'number' && (
            <ProgressBar current={step} total={TRIAGE_STEPS.length} />
          )}

          <div className="min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 'welcome' && (
                <WelcomeStep key="welcome" onStart={nextStep} />
              )}
              
              {currentStepData && (
                <StepRenderer 
                  key={`step-${step}`}
                  step={currentStepData}
                  formData={formData}
                  onUpdate={updateField}
                />
              )}

              {step === 'success' && (
                <SuccessStep 
                  key="success"
                  formData={formData}
                  onReset={resetForm}
                />
              )}
            </AnimatePresence>
          </div>

          {typeof step === 'number' && (
            <footer className="mt-12 md:mt-16 border-t border-teal-900/5 pt-8 md:pt-10 space-y-4">
              {submitError && (
                <p className="text-center text-sm text-red-500 font-medium">
                  Ocorreu um erro ao enviar. Verifique sua conexão e tente novamente.
                </p>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-400 hover:text-teal-petroleum transition-all font-medium uppercase tracking-widest text-[10px]"
                >
                  <ChevronLeft size={16} /> Voltar
                </button>

                <Button
                  onClick={nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className="min-w-[160px] md:min-w-[180px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    <>
                      {step === TRIAGE_STEPS.length ? 'Finalizar Triagem' : 'Continuar'}
                      {step === TRIAGE_STEPS.length ? <Send size={20} /> : <ChevronRight size={22} />}
                    </>
                  )}
                </Button>
              </div>
            </footer>
          )}
        </div>
      </section>
      
      <footer className="fixed bottom-6 text-center w-full text-teal-900/30 text-[10px] uppercase tracking-[0.4em] pointer-events-none">
        Ambiente Seguro & Confidencial • {CONFIG.PSICOLOGO_NOME}
      </footer>
    </main>
  );
}
