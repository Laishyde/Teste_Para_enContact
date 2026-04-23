const API_BASE = "https://my-json-server.typicode.com/EnkiGroup/DesafioFrontEnd2026Jr";

export const getMenus = async () => {
  console.log(`📡 [API] Buscando menus de: ${API_BASE}/menus`);
  const response = await fetch(`${API_BASE}/menus`);
  console.log(`📊 [API] Status da resposta menus: ${response.status}`);
  if (!response.ok) throw new Error("Erro ao buscar menus");
  const data = await response.json();
  console.log(`📋 [API] Menus recebidos da API:`, data);
  
  // Add trash and agendamentos menus to response
  const menusWithExtras = [
    ...data,
    {
      id: 4,
      name: 'Lixeira',
      subMenus: []
    },
    {
      id: 5,
      name: 'Agendamentos',
      subMenus: []
    },
    {
      id: 6,
      name: 'Arquivados',
      subMenus: []
    }
  ];
  console.log(`📋 [API] Menus finais com extras:`, menusWithExtras);
  return menusWithExtras;
};

export const getItems = async (id: number) => {
  console.log(`🔍 [API] Buscando itens para ID: ${id}`);
  
  // Verificar se é um menu principal (1, 2, 3) que não tem endpoint
  if (id === 1 || id === 2 || id === 3) {
    console.log(`⚠️ [API] ID ${id} é um menu principal, não tem endpoint de itens. Use os submenus.`);
    return [];
  }
  
  try {
    // Usar o endpoint correto da API: /items/{id}
    const url = `${API_BASE}/items/${id}`;
    console.log(`📡 [API] Buscando itens de: ${url}`);
    
    const response = await fetch(url);
    console.log(`📊 [API] Status da resposta: ${response.status}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`⚠️ [API] Endpoint ${url} não existe (404)`);
        return [];
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📋 [API] Dados recebidos:`, data);

    // A API retorna { subMenuItems: [...] }
    if (data && data.subMenuItems && Array.isArray(data.subMenuItems)) {
      const items = data.subMenuItems.map((item: any) => ({
        ...item,
        id: item.id || Math.random(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        read: false,
        starred: false,
        category: `Menu ${id}`
      }));

      console.log(`✅ [API] Processados ${items.length} itens para o menu ${id}:`, items);
      return items;
    }

    console.log(`⚠️ [API] Nenhum subMenuItems encontrado para menu ${id}`);
    return [];
    
  } catch (error) {
    console.warn(`❌ [API] Erro ao buscar itens:`, error);
    return [];
  }
};