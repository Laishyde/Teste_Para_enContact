import React from 'react';
import { useAppActions } from '../context/AppContext';

interface OverlayProps {
  onClick?: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ onClick }) => {
  const { toggleSidebar } = useAppActions();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleSidebar();
    }
  };

  return (
    <div 
      className="overlay show-mobile hide-desktop"
      onClick={handleClick}
      aria-label="Fechar menu"
    />
  );
};

export default Overlay;
