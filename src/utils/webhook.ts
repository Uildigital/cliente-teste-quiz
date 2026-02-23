import { TriageFormData } from '../types/triage';

export const formatWebhookPayload = (formData: TriageFormData, eventType: 'quiz_completed' | 'contact_saved') => {
  const now = new Date();
  let phoneDigits = formData.whatsapp.replace(/[^\d]/g, '');
  
  // Remove zero à esquerda se houver (comum no Brasil)
  if (phoneDigits.startsWith('0')) {
    phoneDigits = phoneDigits.substring(1);
  }

  // Se tiver 10 ou 11 dígitos, assume que é Brasil e adiciona 55
  const formattedPhone = (phoneDigits.length === 10 || phoneDigits.length === 11) 
    ? `55${phoneDigits}` 
    : phoneDigits;

  return {
    event: eventType,
    event_type: eventType,
    // Identificação
    nome: formData.nome,
    whatsapp: formattedPhone,
    phone: formattedPhone, // Alias para compatibilidade
    number: formattedPhone, // Alias para compatibilidade
    chatId: `${formattedPhone}@c.us`, // Formato comum para Z-API/WhatsApp
    remoteJid: `${formattedPhone}@s.whatsapp.net`, // Formato comum para instâncias de WhatsApp
    wa_id: formattedPhone, // Formato comum para APIs oficiais
    
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
