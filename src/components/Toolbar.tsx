import React, { useState } from 'react';
import { Archive, Search, Calendar, UserPlus, Trash2 } from 'lucide-react';
import { useApp, useAppActions } from '../context/AppContext';
import CalendarModal from './Calendar';
import '../styles/globals.css';

const Toolbar: React.FC = () => {
  const { state } = useApp();
  const { archiveItems, deleteItems, permanentlyDeleteItems, clearSelection, setSearch, setFilter, addToast } = useAppActions();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleArchive = () => {
    const itemsCount = state.selectedItems.length;
    archiveItems();
    
    // Mostrar Toast de sucesso mais amigável
    addToast({
      type: 'success',
      title: state.language === 'pt' ? ' Arquivado com Sucesso!' : ' Archived Successfully!',
      message: state.language === 'pt' 
        ? `${itemsCount} ${itemsCount === 1 ? 'item foi arquivado' : 'itens foram arquivados'} e agora estão organizados na aba Arquivados` 
        : `${itemsCount} ${itemsCount === 1 ? 'item was archived' : 'items were archived'} and are now organized in the Archived tab`,
      duration: 4000
    });
  };

  const handleDelete = () => {
    const itemsCount = state.selectedItems.length;
    deleteItems();
    
    // Mostrar Toast de sucesso mais amigável
    addToast({
      type: 'warning',
      title: state.language === 'pt' ? ' Movido para Lixeira' : ' Moved to Trash',
      message: state.language === 'pt' 
        ? `${itemsCount} ${itemsCount === 1 ? 'item foi movido' : 'itens foram movidos'} para a lixeira. Você pode recuperá-los na aba Lixeira` 
        : `${itemsCount} ${itemsCount === 1 ? 'item was moved' : 'items were moved'} to trash. You can recover them in the Trash tab`,
      duration: 4000
    });
  };

  const handlePermanentDelete = () => {
    const itemsCount = state.selectedItems.length;
    permanentlyDeleteItems();
    
    // Mostrar Toast de aviso mais amigável
    addToast({
      type: 'error',
      title: state.language === 'pt' ? '⚠️ Exclusão Permanente' : '⚠️ Permanent Deletion',
      message: state.language === 'pt' 
        ? `${itemsCount} ${itemsCount === 1 ? 'item foi excluído permanentemente' : 'itens foram excluídos permanentemente'}. Esta ação não pode ser desfeita!` 
        : `${itemsCount} ${itemsCount === 1 ? 'item was permanently deleted' : 'items were permanently deleted'}. This action cannot be undone!`,
      duration: 6000
    });
  };

  const handleAssign = () => {
    const itemsCount = state.selectedItems.length;
    
    // Mostrar Toast de sucesso mais amigável
    addToast({
      type: 'info',
      title: state.language === 'pt' ? ' Atribuído com Sucesso!' : ' Assigned Successfully!',
      message: state.language === 'pt' 
        ? `${itemsCount} ${itemsCount === 1 ? 'item foi atribuído' : 'itens foram atribuídos'} para responsáveis. Verifique o status em breve.` 
        : `${itemsCount} ${itemsCount === 1 ? 'item was assigned' : 'items were assigned'} to responsible parties. Check status soon.`,
      duration: 4000
    });
    
    // Limpar seleção após atribuir
    clearSelection();
  };

  const hasSelection = state.selectedItems.length > 0;
  const isArchivedTab = state.selectedMenuId === 6;
  const isTrashTab = state.selectedMenuId === 4;

  const handleSchedule = () => {
    setIsCalendarOpen(true);
  };

  return (
    <div 
      className="flex items-center justify-between p-4 border-b gap-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center gap-3">
        {/* Campo de busca */}
        <div className="max-w-[320px] flex-shrink-0">
          <div className="relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder={state.language === 'pt' ? 'Pesquisar...' : 'Search...'}
              value={state.searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 w-full text-sm"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                height: '2.25rem',
                width: '320px',
                maxWidth: '320px'
              }}
            />
          </div>
        </div>

        {/* Filtros */}
        <select
          value={state.filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read' | 'scheduled' | 'archived' | 'trash')}
          className="input"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
        >
          <option value="all">{state.language === 'pt' ? 'Todos' : 'All'}</option>
          <option value="unread">{state.language === 'pt' ? 'Não lidos' : 'Unread'}</option>
          <option value="read">{state.language === 'pt' ? 'Lidos' : 'Read'}</option>
          <option value="scheduled">{state.language === 'pt' ? 'Agendados' : 'Scheduled'}</option>
          <option value="archived">{state.language === 'pt' ? 'Arquivados' : 'Archived'}</option>
          <option value="trash">{state.language === 'pt' ? 'Lixeira' : 'Trash'}</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        {/* Ações quando há seleção */}
        {hasSelection ? (
          <>
            <button
              onClick={handleArchive}
              className="btn btn-primary"
              disabled={isArchivedTab}
              title={isArchivedTab ? "Não é possível arquivar itens na aba de arquivados" : `Arquivar ${state.selectedItems.length} item(ns)`}
            >
              <Archive size={16} />
              <span className="hide-mobile">Arquivar</span>
              <span 
                className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: 'var(--color-primary-hover)',
                  minWidth: '1.5rem',
                  height: '1.5rem'
                }}
              >
                {state.selectedItems.length}
              </span>
            </button>

            <button onClick={handleAssign} className="btn btn-secondary">
              <UserPlus size={16} />
              <span className="hide-mobile">Atribuir</span>
            </button>

            <button onClick={handleSchedule} className="btn btn-secondary">
              <Calendar size={16} />
              <span className="hide-mobile">Agendar</span>
            </button>

            <button 
              onClick={isTrashTab ? handlePermanentDelete : handleDelete} 
              className="btn btn-secondary" 
              style={{ 
                color: isTrashTab ? 'var(--color-danger)' : 'var(--color-danger)',
                backgroundColor: isTrashTab ? 'var(--color-danger-light)' : 'transparent',
                borderColor: isTrashTab ? 'var(--color-danger)' : 'var(--color-border)'
              }}
              title={isTrashTab 
                ? `Excluir permanentemente ${state.selectedItems.length} item(ns)` 
                : `Mover para lixeira ${state.selectedItems.length} item(ns)`
              }
            >
              <Trash2 size={16} />
              <span className="hide-mobile">{isTrashTab ? 'Excluir Permanentemente' : 'Excluir'}</span>
            </button>
          </>
        ) : (
          <div 
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Selecione itens para ações
          </div>
        )}
      </div>
      
      {/* Calendar Modal */}
      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />
    </div>
  );
};

export default Toolbar;
