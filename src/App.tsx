import React, { useEffect } from 'react';
import { AppProvider, useApp, useAppActions } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { initializeAutoTranslate } from './utils/initAutoTranslate';
import { getMenus, getItems } from './services/api';
import Login from './pages/Login';
import Layout from './components/Layout';
import './styles/globals.css';

// Sample messages for fallback
const getSampleMessages = () => [
  {
    id: 1,
    name: 'João Silva',
    subject: 'Bem-vindo ao enContact',
    owner: 'Sistema',
    users: ['João Silva', 'Maria Santos'],
    date: '2024-01-15',
    time: '10:30'
  },
  {
    id: 2,
    name: 'Maria Santos',
    subject: 'Reunião de equipe',
    owner: 'Pedro Costa',
    users: ['Pedro Costa'],
    date: '2024-01-14',
    time: '14:00'
  },
  {
    id: 3,
    name: 'Ana Oliveira',
    subject: 'Atualização do sistema',
    owner: 'Carlos Ferreira',
    users: ['Ana Oliveira', 'Carlos Ferreira'],
    date: '2024-01-13',
    time: '09:15'
  },
  {
    id: 4,
    name: 'Lucas Mendes',
    subject: 'Projeto em andamento',
    owner: 'Lucas Mendes',
    users: ['Lucas Mendes'],
    date: '2024-01-12',
    time: '16:45'
  },
  {
    id: 5,
    name: 'Juliana Ramos',
    subject: 'Feedback importante',
    owner: 'Juliana Ramos',
    users: ['Juliana Ramos'],
    date: '2024-01-11',
    time: '11:20'
  }
];

// Componente principal que usa o contexto
const AppContent: React.FC = () => {
  const { state } = useApp();
  const { setMenus, setSelectedMenu, setItems, setLoading, toggleSidebar } = useAppActions();

  // Initialize automatic translation system
  useEffect(() => {
    initializeAutoTranslate();
  }, []);

  // Trigger translation when user logs in and dashboard loads
  useEffect(() => {
    if (state.isLoggedIn && window.autoTranslator) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const currentLang = window.autoTranslator.getCurrentLanguage();
        if (currentLang !== 'pt') {
          window.autoTranslator.translatePage();
        }
      }, 500);
    }
  }, [state.isLoggedIn]);

  // Carregar menus quando o usuário fizer login
  useEffect(() => {
    if (state.isLoggedIn && state.menus.length === 0) {
      setLoading(true);
      const loadMenus = async () => {
        try {
          const menus = await getMenus();
          setMenus(menus);
          setSelectedMenu(menus[0]?.id || 1);
        } catch (error) {
          console.error('Error loading menus:', error);
        } finally {
          setLoading(false);
        }
      };
      loadMenus();
    }
  }, [state.isLoggedIn, state.menus.length, setMenus, setSelectedMenu, setLoading]);

  // Carregar itens quando um menu for selecionado
  useEffect(() => {
    if (state.selectedMenuId && state.isLoggedIn && state.menus.length > 0) {
      setLoading(true);
      const loadItems = async () => {
        try {
          // Se for o menu de lixeira (ID 4), mostrar itens excluídos
          if (state.selectedMenuId === 4) {
            setItems(state.deletedItems);
          } else if (state.selectedMenuId === 5) {
            // Menu de agendamentos (ID 5), mostrar itens agendados
            setItems(state.scheduledItems);
          } else if (state.selectedMenuId === 6) {
            // Menu de arquivados (ID 6), mostrar itens arquivados
            setItems(state.archivedItems);
          } else {
            const items = await getItems(state.selectedMenuId!);
            // If API returns null or empty items, use sample messages
            if (!items || items.length === 0) {
              const sampleMessages = getSampleMessages();
              setItems(sampleMessages);
            } else {
              setItems(items);
            }
          }
          
          // Auto-fechar sidebar no mobile após selecionar menu
          if (window.innerWidth <= 768) {
            toggleSidebar();
          }
        } catch (error) {
          console.error('Erro ao carregar itens:', error);
          // Add sample messages as fallback
          const sampleMessages = getSampleMessages();
          setItems(sampleMessages);
        } finally {
          setLoading(false);
          
          // Trigger translation after items are loaded
          if (window.autoTranslator && state.items.length > 0) {
            setTimeout(() => {
              const currentLang = window.autoTranslator.getCurrentLanguage();
              if (currentLang !== 'pt') {
                window.autoTranslator.translatePage();
              }
            }, 200);
          }
        }
      };
      loadItems();
    }
  }, [state.selectedMenuId, state.isLoggedIn, state.menus.length, state.deletedItems, state.scheduledItems, state.archivedItems, state.items.length, setItems, setLoading, toggleSidebar]);

  // Renderizar Login ou Layout principal
  if (!state.isLoggedIn) {
    return <Login />;
  }

  return <Layout />;
};

// Componente App com Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AppProvider>
  );
};

export default App;
