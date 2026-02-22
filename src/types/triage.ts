import React from 'react';

export type StepId = 'welcome' | number | 'success';

export interface TriageFormData {
  nome: string;
  whatsapp: string;
  faixa_etaria: string;
  motivo: string;
  motivo_outro: string;
  tempo_convivio: string;
  impacto_rotina: string;
  historico: string;
  modalidade: string;
  filtro_financeiro: string;
  periodo: string;
  comprometimento: string;
}

export interface TriageStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  field: keyof TriageFormData;
  type: 'text' | 'select' | 'scale';
  options?: string[];
}
