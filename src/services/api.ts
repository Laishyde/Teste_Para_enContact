const API_BASE = "https://my-json-server.typicode.com/EnkiGroup/DesafioFrontEnd2026Jr";

export const getMenus = async () => {
  const response = await fetch(`${API_BASE}/menus`);
  if (!response.ok) throw new Error("Erro ao buscar menus");
  const data = await response.json();
  
  // Add trash and agendamentos menus to response
  return [
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
};

export const getItems = async (id: number) => {
  console.log(`Buscando itens para ID: ${id}`);
  
  // Immediately return sample data if API fails
  try {
    const url = `${API_BASE}/items/${id}`;
    console.log(`URL completa: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Status da resposta: ${response.status}`);
    
    if (!response.ok) {
      console.warn(`API retornou erro ${response.status}, usando dados de exemplo`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dados recebidos:', data);

    // A API retorna { subMenuItems: [...] }
    if (data && data.subMenuItems && Array.isArray(data.subMenuItems)) {
      const items = data.subMenuItems.map((item: any) => ({
        ...item,
        id: item.id || Math.random(),
        users: Array.isArray(item.users) ? item.users : [],
      }));

      return items.length > 0 ? items : null;
    }

    // Fallback para outros formatos
    const normalized = Array.isArray(data)
      ? data
      : data && typeof data === "object"
      ? [data]
      : [];

    const items = normalized.map((item: any) => ({
      ...item,
      id: item.id || Math.random(),
      users: Array.isArray(item.users) ? item.users : [],
    }));

    return items.length > 0 ? items : null;
  } catch (error) {
    console.warn('API não disponível, retornando null para usar dados de exemplo:', error);
    return null; // Return null to indicate API failure
  }
};