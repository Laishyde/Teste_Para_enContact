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
    console.log(`🔄 [APP] useEffect menus - isLoggedIn: ${state.isLoggedIn}, menus.length: ${state.menus.length}`);
    if (state.isLoggedIn && state.menus.length === 0) {
      console.log(`📥 [APP] Iniciando carregamento de menus`);
      setLoading(true);
      const loadMenus = async () => {
        try {
          const menus = await getMenus();
          console.log(`📋 [APP] Menus carregados:`, menus);
          setMenus(menus);
          // Encontrar o primeiro submenu disponível
          let firstSubMenuId = null;
          for (const menu of menus) {
            if (menu.subMenus && menu.subMenus.length > 0) {
              firstSubMenuId = menu.subMenus[0].id;
              break;
            }
          }
          const firstMenuId = firstSubMenuId || 11; // Fallback para ID 11
          console.log(`🎯 [APP] Selecionando primeiro submenu: ${firstMenuId}`);
          setSelectedMenu(firstMenuId);
        } catch (error) {
          console.error('❌ [APP] Error loading menus:', error);
        } finally {
          setLoading(false);
        }
      };
      loadMenus();
    }
  }, [state.isLoggedIn, state.menus.length, setMenus, setSelectedMenu, setLoading]);

  // Carregar itens quando um menu for selecionado
  useEffect(() => {
    console.log(`🔄 [APP] useEffect itens - selectedMenuId: ${state.selectedMenuId}, isLoggedIn: ${state.isLoggedIn}, menus.length: ${state.menus.length}`);
    if (state.selectedMenuId && state.isLoggedIn && state.menus.length > 0) {
      console.log(`📥 [APP] Iniciando carregamento de itens para menu ${state.selectedMenuId}`);
      setLoading(true);
      const loadItems = async () => {
        try {
          // Se for o menu de lixeira (ID 4), mostrar itens excluídos
          if (state.selectedMenuId === 4) {
            console.log(`🗑️ [APP] Carregando itens da lixeira`);
            setItems(state.deletedItems);
          } else if (state.selectedMenuId === 5) {
            // Menu de agendamentos (ID 5), mostrar itens agendados
            console.log(`📅 [APP] Carregando itens agendados`);
            setItems(state.scheduledItems);
          } else if (state.selectedMenuId === 6) {
            // Menu de arquivados (ID 6), mostrar itens arquivados
            console.log(`📁 [APP] Carregando itens arquivados`);
            setItems(state.archivedItems);
          } else {
            console.log(`📦 [APP] Buscando itens da API para menu ${state.selectedMenuId}`);
            const items = await getItems(state.selectedMenuId!);
            console.log(`📋 [APP] Itens recebidos da API:`, items);
            // If API returns null or empty items, use sample messages
            if (!items || items.length === 0) {
              console.log(`⚠️ [APP] API retornou vazio, usando dados de exemplo`);
              const sampleMessages = getSampleMessages();
              console.log(`📝 [APP] Mensagens de exemplo:`, sampleMessages);
              setItems(sampleMessages);
            } else {
              console.log(`✅ [APP] Usando itens da API`);
              setItems(items);
            }
          }
          
          // Auto-fechar sidebar no mobile após selecionar menu
          if (window.innerWidth <= 768) {
            toggleSidebar();
          }
        } catch (error) {
          console.error('❌ [APP] Erro ao carregar itens:', error);
          // Add sample messages as fallback
          const sampleMessages = getSampleMessages();
          setItems(sampleMessages);
        } finally {
          setLoading(false);
          
          // Trigger translation after items are loaded - usar ref para evitar loop
          setTimeout(() => {
            if (window.autoTranslator) {
              const currentLang = window.autoTranslator.getCurrentLanguage();
              if (currentLang !== 'pt') {
                window.autoTranslator.translatePage();
              }
            }
          }, 200);
        }
      };
      loadItems();
    }
  }, [state.selectedMenuId, state.isLoggedIn, state.menus.length, state.deletedItems, state.scheduledItems, state.archivedItems, setItems, setLoading, toggleSidebar]);

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
