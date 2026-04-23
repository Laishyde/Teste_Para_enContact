import React from 'react';
import { useApp } from '../context/AppContext';
import MessageCard from './MessageCard';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import '../styles/globals.css';

const MessageList: React.FC = () => {
  const { state } = useApp();

  // Filtrar itens baseado na busca e filtro
  const filteredItems = state.items.filter(item => {
    const matchesSearch = state.searchQuery === '' || 
      (item.name && item.name.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
      (item.subject && item.subject.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
      (item.date && item.date.toLowerCase().includes(state.searchQuery.toLowerCase()));
    
    let matchesFilter = true;
    
    // Se estamos na aba de agendamentos (menu ID 5), não aplicar filtro adicional
    // porque os itens já foram carregados corretamente como agendados
    if (state.selectedMenuId === 5) {
      matchesFilter = true;
    } else if (state.selectedMenuId === 6) {
      // Se estamos na aba de arquivados (menu ID 6), não aplicar filtro adicional
      matchesFilter = true;
    } else if (state.selectedMenuId === 4) {
      // Se estamos na aba de lixeira (menu ID 4), não aplicar filtro adicional
      matchesFilter = true;
    } else {
      // Para outros menus (caixa de entrada principal), verificar o filtro selecionado
      switch (state.filter) {
        case 'all':
          // Mostrar apenas itens que não foram movidos para outras abas
          const isArchived = state.archivedItems.some(archivedItem => archivedItem.id === item.id);
          const isDeleted = state.deletedItems.some(deletedItem => deletedItem.id === item.id);
          const isScheduled = state.scheduledItems.some(scheduledItem => scheduledItem.id === item.id);
          matchesFilter = !isArchived && !isDeleted && !isScheduled;
          break;
        case 'unread':
          // Mostrar apenas itens não lidos e que não foram movidos
          const isArchivedUnread = state.archivedItems.some(archivedItem => archivedItem.id === item.id);
          const isDeletedUnread = state.deletedItems.some(deletedItem => deletedItem.id === item.id);
          const isScheduledUnread = state.scheduledItems.some(scheduledItem => scheduledItem.id === item.id);
          matchesFilter = !isArchivedUnread && !isDeletedUnread && !isScheduledUnread && 
                         Boolean(item.subject && !item.subject.includes('[LIDO]'));
          break;
        case 'read':
          // Mostrar apenas itens lidos e que não foram movidos
          const isArchivedRead = state.archivedItems.some(archivedItem => archivedItem.id === item.id);
          const isDeletedRead = state.deletedItems.some(deletedItem => deletedItem.id === item.id);
          const isScheduledRead = state.scheduledItems.some(scheduledItem => scheduledItem.id === item.id);
          matchesFilter = !isArchivedRead && !isDeletedRead && !isScheduledRead && 
                         Boolean(item.subject && item.subject.includes('[LIDO]'));
          break;
        case 'scheduled':
          // Mostrar itens agendados
          matchesFilter = state.scheduledItems.some(scheduledItem => scheduledItem.id === item.id);
          break;
        case 'archived':
          // Mostrar itens arquivados
          matchesFilter = state.archivedItems.some(archivedItem => archivedItem.id === item.id);
          break;
        case 'trash':
          // Mostrar itens na lixeira
          matchesFilter = state.deletedItems.some(deletedItem => deletedItem.id === item.id);
          break;
        default:
          matchesFilter = true;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  if (state.loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!state.selectedMenuId) {
    return <EmptyState type="no-selection" />;
  }

  if (filteredItems.length === 0) {
    return <EmptyState type={state.searchQuery ? 'no-results' : 'no-items'} searchQuery={state.searchQuery} />;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {filteredItems.map((item, index) => (
          <MessageCard 
            key={`${item.id}-${index}`} 
            item={item}
            isAnySelected={state.selectedItems.length > 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
