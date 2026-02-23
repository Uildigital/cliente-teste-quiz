import { TriageFormData } from '../types/triage';

export const formatWebhookPayload = (formData: TriageFormData, eventType: 'quiz_completed' | 'contact_saved') => {
  const now = new Date();
  const phoneDigits = formData.whatsapp.replace(/[^\d]/g, '');
  const formattedPhone = phoneDigits.length <= 11 ? `55${phoneDigits}` : phoneDigits;

  return {
    event_type: eventType,
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
};
