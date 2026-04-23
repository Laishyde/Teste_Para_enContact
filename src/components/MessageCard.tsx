import React, { useState, useRef } from 'react';
import { Mail, Clock, Users, CheckCircle } from 'lucide-react';
import { useApp, useAppActions } from '../context/AppContext';
import { MessageItem } from '../types';
import { formatDateTime } from '../utils/dateUtils';
import '../styles/globals.css';

interface MessageCardProps {
  item: MessageItem;
  isAnySelected: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ item, isAnySelected }) => {
  const { state } = useApp();
  const { toggleItemSelection } = useAppActions();
  
  const [isHovered, setIsHovered] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const isSelected = state.selectedItems.includes(item.id);
  
  // Show checkbox immediately if any item is selected, otherwise with delay
  React.useEffect(() => {
    if (isAnySelected) {
      setShowCheckbox(true);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    } else {
      setShowCheckbox(isHovered);
    }
  }, [isAnySelected, isHovered]);

  const handleMouseEnter = () => {
    if (!isAnySelected) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 150); // 150ms delay for smoother hover
    }
  };

  const handleMouseLeave = () => {
    if (!isAnySelected) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100); // 100ms delay for smoother leave
    }
  };
  
  const handleCardClick = () => {
    if (showCheckbox) {
      toggleItemSelection(item.id);
    }
  };

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleItemSelection(item.id);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const isRead = item.subject && item.subject.includes('[LIDO]');
  
  return (
    <div 
      className={`group cursor-pointer transition-all duration-200 animate-fade-in ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
      style={{
        backgroundColor: isSelected 
          ? 'var(--color-primary)10' 
          : isHovered 
            ? 'var(--color-surface)' 
            : 'transparent'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Checkbox ou Avatar */}
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center relative">
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
            style={{ 
              opacity: showCheckbox ? 1 : 0,
              transform: showCheckbox ? 'scale(1)' : 'scale(0.8)'
            }}
          >
            {showCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxClick}
                className="checkbox"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
            style={{ 
              opacity: !showCheckbox ? 1 : 0,
              transform: !showCheckbox ? 'scale(1)' : 'scale(0.8)'
            }}
          >
            {!showCheckbox && (
              <div className="avatar avatar-sm">
                {getInitials(item.owner || 'Unknown')}
              </div>
            )}
          </div>
        </div>
        
        {/* Ícone de status */}
        <div className="flex-shrink-0">
          {isRead ? (
            <CheckCircle 
              size={16} 
              style={{ color: 'var(--color-success)' }}
            />
          ) : (
            <Mail 
              size={16} 
              style={{ color: 'var(--color-text-muted)' }}
            />
          )}
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className={`font-medium truncate ${
                !isRead ? 'font-semibold' : ''
              }`}
              style={{ 
                color: isRead 
                  ? 'var(--color-text-secondary)' 
                  : 'var(--color-text-primary)' 
              }}
            >
              {item.owner || 'Unknown'}
            </span>
            {item.users && item.users.length > 0 && (
              <div className="flex items-center gap-1">
                <Users size={12} style={{ color: 'var(--color-text-muted)' }} />
                <span 
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.users.length}
                </span>
              </div>
            )}
          </div>
          
          <div className="truncate">
            <span 
              className={`text-sm ${
                !isRead ? 'font-medium' : ''
              }`}
              style={{ 
                color: isRead 
                  ? 'var(--color-text-secondary)' 
                  : 'var(--color-text-primary)' 
              }}
            >
              {item.subject || 'Sem assunto'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="text-xs truncate"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {item.name || 'Sem descrição'}
            </span>
            {item.time && (
              <div className="flex items-center gap-1">
                <Clock size={10} style={{ color: 'var(--color-text-muted)' }} />
                <span 
                  className="text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.time}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Data/Hora no lado direito */}
        {item.date && (
          <div 
            className="flex-shrink-0 text-xs text-right"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {formatDateTime(item.date)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
