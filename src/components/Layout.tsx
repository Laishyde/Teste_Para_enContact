import React from 'react';
import { useApp } from '../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Overlay from './Overlay';
import ToastContainer from './ToastContainer';

const Layout: React.FC = () => {
  const { state } = useApp();

  if (!state.isLoggedIn) {
    return null; // Login será tratado no App.tsx
  }

  return (
    <div 
      className="h-screen flex flex-col overflow-hidden transition-colors duration-300"
      data-theme={state.theme}
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)'
      }}
    >
      {/* Header */}
      <Header />

      {/* Conteúdo principal */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Overlay para mobile */}
        {state.isSidebarOpen && (
          <Overlay />
        )}

        {/* Main Content */}
        <MainContent />
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Layout;
