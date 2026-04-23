# enContact - Sistema de Gerenciamento de Contatos

Uma aplicação React moderna para gerenciamento de contatos e mensagens, desenvolvida com TypeScript, Tailwind CSS e boas práticas de desenvolvimento.

## Funcionalidades

- **Autenticação de Usuários**: Sistema de login simples com credenciais padrão
- **Dashboard Interativo**: Interface principal com navegação lateral
- **Gestão de Menus**: Menus dinâmicos carregados da API
- **Lista de Mensagens**: Visualização de itens/mensagens com seleção múltipla
- **Ações em Lote**: Funcionalidade de arquivar múltiplos itens
- **Temas**: Suporte para temas claro e escuro
- **Internacionalização**: Suporte para português e inglês
- **Design Responsivo**: Interface adaptável para diferentes dispositivos

## Tecnologias Utilizadas neste projeto

- **React 18** - Biblioteca principal de UI
- **TypeScript** - Tipagem estática para melhor desenvolvimento
- **Tailwind CSS** - Framework de CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **React Hooks** - Gerenciamento de estado local

## Estrutura do Projeto

```
src/
|
components/          # Componentes reutilizáveis
  |- Calendar.tsx    # Componente de calendário
  |- EmptyState.tsx  # Estado vazio para listas
  |- Footer.tsx      # Rodapé da aplicação
  |- Header.tsx      # Cabeçalho principal com navegação
  |- Layout.tsx      # Layout principal da aplicação
  |- LoadingSpinner.tsx # Indicador de carregamento
  |- MainContent.tsx # Conteúdo principal
  |- MessageCard.tsx # Card individual de mensagem
  |- MessageItem.tsx # Item de mensagem detalhado
  |- MessageList.tsx # Lista de mensagens
  |- Overlay.tsx     # Overlay para modais
  |- Sidebar.tsx     # Navegação lateral responsiva
  |- Toast.tsx       # Notificações toast
  |- ToastContainer.tsx # Container para toasts
  |- Toolbar.tsx     # Barra de ferramentas
  |- TopBar.tsx      # Barra superior
  |- UserMenu.tsx    # Menu de usuário
|
pages/               # Páginas principais
  |- Login.tsx       # Página de autenticação
  |- Dashboard.tsx   # Dashboard principal
|
services/            # Serviços de API
  |- api.ts          # Funções de chamada à API
|
hooks/               # Hooks customizados
  |- useFetch.ts     # Hook para gerenciamento de API
|
context/             # Contextos React
  |- AppContext.tsx  # Estado global da aplicação
  |- LanguageContext.tsx # Gerenciamento de idioma
  |- ThemeContext.tsx # Gerenciamento de tema
|
utils/               # Utilitários
  |- autoTranslate.ts # Sistema de tradução automática
  |- dateUtils.ts    # Funções de manipulação de datas
  |- initAutoTranslate.ts # Inicialização da tradução
|
styles/              # Estilos globais
  |- globals.css     # Estilos CSS globais
|
types/               # Definições de tipos TypeScript
  |- images.d.ts     # Tipos para imagens
  |- index.ts        # Interfaces e tipos principais
|
assets/              # Recursos estáticos
  |- logo.png        # Logo da aplicação
|
App.tsx              # Componente principal da aplicação
index.tsx            # Ponto de entrada
index.css            # Estilos base
```

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**:
   ```bash
   git clone <URL-do-repositório>
   cd teste_front
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie a aplicação**:
   ```bash
   npm start
   ```

4. **Acesse a aplicação**:
   Abra `http://localhost:3000` no seu navegador

## Configuração da API

### API de Dados

A aplicação utiliza a API JSON Server para dados de exemplo:

```
https://my-json-server.typicode.com/EnkiGroup/DesafioFrontEnd2026Jr
```

#### Endpoints Disponíveis

- `GET /menus` - Lista de menus principais
- `GET /items/:id` - Itens de um menu específico

### API de Tradução Automática

A aplicação utiliza a **Google Translate Web API** para tradução automática de conteúdo:

```
https://translate.googleapis.com/translate_a/single
```

#### Características da API de Tradução

- **Gratuita**: Utiliza endpoint público do Google Translate
- **Sem Autenticação**: Não requer chave de API
- **Cache Local**: Implementa cache inteligente para evitar requisições duplicadas
- **Tradução em Tempo Real**: Traduz toda a interface dinamicamente
- **Suporte a Múltiplos Idiomas**: Português (origem), Inglês e Espanhol

#### Idiomas Suportados

- **Português (pt)**: Idioma padrão/original da aplicação
- **Inglês (en)**: Tradução automática via Google Translate
- **Espanhol (es)**: Tradução automática via Google Translate

#### Funcionalidades

- **Tradução de Interface**: Traduz automaticamente todos os textos da interface
- **Proteção de Elementos**: Ignora ícones, bandeiras e elementos com `data-no-translate`
- **Restauração**: Retorna ao idioma original sem necessidade de reload
- **Cache Inteligente**: Armazena traduções para melhor performance

## Uso da Aplicação

### Login

- **Usuário padrão**: `Admin`
- **Senha padrão**: `Admin`

Após o login, você será redirecionado para o dashboard principal.

### Navegação

1. **Menu Lateral**: Clique nos submenus para carregar diferentes conjuntos de dados
2. **Seleção de Itens**: Clique nos cards para selecionar múltiplos itens
3. **Ações**: Use a toolbar para arquivar itens selecionados
4. **Logout**: Clique no botão "Sair" no header para sair do sistema

## Desenvolvimento

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta do Create React App (irreversível)

### Boas Práticas Implementadas

- **TypeScript**: Tipagem forte em todo o código
- **Componentes Funcionais**: Uso de hooks em vez de classes
- **Custom Hooks**: Lógica reutilizável separada
- **Context API**: Gerenciamento de estado global
- **CSS Modular**: Tailwind CSS para estilos consistentes
- **Comentários**: Documentação detalhada do código
- **Error Handling**: Tratamento de erros em chamadas de API
- **Loading States**: Indicadores visuais de carregamento

### Extensões Recomendadas para VS Code

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob licença MIT.

## Suporte

Para dúvidas ou suporte, entre em contato através das issues do repositório.
