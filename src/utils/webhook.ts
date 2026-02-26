import { TriageFormData } from '../types/triage';

export const formatWebhookPayload = (formData: TriageFormData, eventType: 'quiz_completed' | 'contact_saved') => {
  const now = new Date();
  
  // 1. Formatação de WhatsApp (String Pura: DDI + DDD + Número)
  let phoneDigits = formData.whatsapp.replace(/[^\d]/g, '');
  if (phoneDigits.startsWith('0')) {
    phoneDigits = phoneDigits.substring(1);
  }
  const formattedPhone = (phoneDigits.length === 10 || phoneDigits.length === 11) 
    ? `55${phoneDigits}` 
    : phoneDigits;

  // 2. Tratamento da Opção 'Outros' para o Motivo
  const motivoFinal = (formData.motivo === 'Outros' ? formData.motivo_outro : formData.motivo).trim();

  // 3. Formatação de Data e Hora para Google Agenda
  const dataIso = now.toISOString().split('T')[0]; // AAAA-MM-DD
  const horaEnvio = now.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  // 4. Estrutura Flat e Limpeza de Texto (.trim())
  return {
    event: eventType,
    nome: formData.nome.trim(),
    whatsapp: formattedPhone, // String pura de números
    motivo_final: motivoFinal,
    faixa_etaria: formData.faixa_etaria.trim(),
    tempo_convivio: formData.tempo_convivio.trim(),
    impacto_na_rotina: formData.impacto_rotina.trim(),
    experiencia_anterior: formData.historico.trim(),
    modalidade_preferida: formData.modalidade.trim(),
    periodo_preferencia: formData.periodo.trim(),
    prontidao_mudanca: formData.comprometimento.trim(),
    
    // Campos para Google Agenda / Automação
    data_iso: dataIso,
    data_agendamento: dataIso,
    hora_envio: horaEnvio,
    timestamp: now.toISOString()
  };
};
