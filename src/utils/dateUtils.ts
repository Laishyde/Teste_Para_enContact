/**
 * Utilitários para formatação de data e hora
 */

/**
 * Formata a data de acordo com as regras especificadas:
 * - Hoje: "Hoje, 14:32"
 * - Ontem: "Ontem, 09:10" 
 * - Datas anteriores: "22/04/2026, 08:45"
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Resetar horas para comparar apenas datas
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Formatar hora
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  if (inputDate.getTime() === today.getTime()) {
    // Hoje
    return `Hoje, ${timeStr}`;
  } else if (inputDate.getTime() === yesterday.getTime()) {
    // Ontem
    return `Ontem, ${timeStr}`;
  } else {
    // Data anterior
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}, ${timeStr}`;
  }
};

/**
 * Formata a data para exibição em formato abreviado se necessário
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Resetar horas para comparar apenas datas
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (inputDate.getTime() === today.getTime()) {
    return 'Hoje';
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

/**
 * Formata apenas a hora
 */
export const formatTime = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
