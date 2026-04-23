import React from 'react';
import { Inbox, Search, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/globals.css';

interface EmptyStateProps {
  type: 'no-selection' | 'no-results' | 'no-items';
  searchQuery?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  searchQuery
}) => {
  const { language } = useLanguage();
  const getIcon = () => {
    switch (type) {
      case 'no-selection':
        return <Inbox size={48} />;
      case 'no-results':
        return <Search size={48} />;
      case 'no-items':
        return <Calendar size={48} />;
      default:
        return <Inbox size={48} />;
    }
  };

  const getTitle = () => {
    if (language === 'en') {
      switch (type) {
        case 'no-selection':
          return 'No folder selected';
        case 'no-results':
          return 'No results found';
        case 'no-items':
          return 'No messages';
        default:
          return 'No data';
      }
    } else if (language === 'es') {
      switch (type) {
        case 'no-selection':
          return 'Ninguna carpeta seleccionada';
        case 'no-results':
          return 'No se encontraron resultados';
        case 'no-items':
          return 'Sin mensajes';
        default:
          return 'Sin datos';
      }
    } else {
      switch (type) {
        case 'no-selection':
          return 'Nenhuma pasta selecionada';
        case 'no-results':
          return 'Nenhuma mensagem encontrada';
        case 'no-items':
          return 'Nenhuma mensagem';
        default:
          return 'Sem dados';
      }
    }
  };

  const getDescription = () => {
    if (language === 'en') {
      switch (type) {
        case 'no-selection':
          return 'Select a folder to view messages';
        case 'no-results':
          return searchQuery ? 'Try a different search term' : 'This folder is empty';
        case 'no-items':
          return 'There are no messages in this folder';
        default:
          return '';
      }
    } else if (language === 'es') {
      switch (type) {
        case 'no-selection':
          return 'Seleccione una carpeta para ver los mensajes';
        case 'no-results':
          return searchQuery ? 'Pruebe con otro término de búsqueda' : 'Esta carpeta está vacía';
        case 'no-items':
          return 'No hay mensajes en esta carpeta';
        default:
          return '';
      }
    } else {
      switch (type) {
        case 'no-selection':
          return 'Selecione uma pasta para ver as mensagens';
        case 'no-results':
          return searchQuery ? 'Tente uma busca diferente' : 'Esta pasta está vazia';
        case 'no-items':
          return 'Não há mensagens nesta pasta';
        default:
          return '';
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div 
        className="text-center max-w-md mx-auto p-8 animate-fade-in"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <div className="flex justify-center mb-4">
          <div 
            className="p-4 rounded-full"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)'
            }}
          >
            {getIcon()}
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          {getTitle()}
        </h3>
        
        <p className="text-sm">
          {getDescription()}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
