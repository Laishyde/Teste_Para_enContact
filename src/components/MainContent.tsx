import React from 'react';
import Toolbar from './Toolbar';
import MessageList from './MessageList';
import '../styles/globals.css';

const MainContent: React.FC = () => {
  return (
    <main 
      className="flex-1 flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Toolbar */}
      <Toolbar />
      
      {/* Message List */}
      <MessageList />
    </main>
  );
};

export default MainContent;
