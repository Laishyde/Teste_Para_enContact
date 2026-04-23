// Utilitário de tradução automática simples - sem armazenamento
class AutoTranslator {
  private cache: Map<string, Map<string, string>> = new Map();
  private currentLanguage: string = 'pt';
  private translatedTexts: Map<Text, string> = new Map(); // Armazena textos traduzidos para restauração

  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'pt';
  }

  setLanguage(lang: string) {
    if (this.currentLanguage === lang) return;
    
    console.log(`Mudando idioma para: ${lang}`);
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    if (lang === 'pt') {
      // Restaurar textos originais sem reload
      this.restoreOriginalTexts();
    } else {
      // Traduzir para o novo idioma
      this.translatePage();
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Traduzir texto usando Google Translate web API
  async translateText(text: string, fromLang: string = 'pt', toLang: string = 'en'): Promise<string> {
    if (fromLang === toLang) return text;

    // Verificar cache primeiro
    const cacheKey = `${fromLang}-${toLang}`;
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, new Map());
    }
    const langCache = this.cache.get(cacheKey)!;
    
    if (langCache.has(text)) {
      return langCache.get(text)!;
    }

    try {
      // Usar Google Translate web API (grátis)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('API de tradução falhou');
      }
      
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translatedText = data[0][0][0];
        langCache.set(text, translatedText);
        return translatedText;
      }
    } catch (error) {
      console.warn('Tradução falhou, usando texto original:', error);
    }
    
    return text; // Fallback para texto original
  }

  // Traduzir todos os nós de texto da página
  async translatePage() {
    if (this.currentLanguage === 'pt') {
      // Se for português, apenas restaurar
      this.restoreOriginalTexts();
      return;
    }

    const textNodes = this.getTextNodes(document.body);
    const translations: Promise<void>[] = [];

    for (const node of textNodes) {
      const originalText = node.textContent?.trim();
      if (originalText && originalText.length > 0) {
        translations.push(
          this.translateText(originalText, 'pt', this.currentLanguage)
            .then(translated => {
              if (node.textContent) {
                // Armazenar texto original antes de traduzir
                if (!this.translatedTexts.has(node)) {
                  this.translatedTexts.set(node, originalText);
                }
                node.textContent = translated;
              }
            })
        );
      }
    }

    await Promise.all(translations);
  }

  // Restaurar textos originais sem reload
  restoreOriginalTexts() {
    console.log('Restaurando textos originais sem reload...');
    
    let restoredCount = 0;
    
    // Restaurar textos usando o mapa de textos traduzidos
    for (const [node, originalText] of this.translatedTexts) {
      if (node.isConnected && node.textContent !== originalText) {
        if (restoredCount < 3) {
          console.log(`Restaurando: "${node.textContent}" -> "${originalText}"`);
        }
        node.textContent = originalText;
        restoredCount++;
      }
    }
    
    // Limpar textos traduzidos após restauração
    if (restoredCount > 0) {
      this.translatedTexts.clear();
      console.log(`Restaurados ${restoredCount} textos para português original`);
    }
  }

  // Get all text nodes from an element
  private getTextNodes(element: Element): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and input elements
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'input', 'textarea'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip if text is just whitespace
          if (!node.textContent?.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip protected elements
          if (this.isProtectedElement(parent)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip if text contains only emojis or flags
          if (this.isEmojiOrFlagOnly(node.textContent)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    // eslint-disable-next-line no-cond-assign
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }
    
    return textNodes;
  }

  // Check if element should be protected from translation
  private isProtectedElement(element: Element): boolean {
    // Check for data-no-translate attribute
    if (element.hasAttribute('data-no-translate') && element.getAttribute('data-no-translate') === 'true') {
      return true;
    }
    
    // Check for no-translate class
    if (element.classList.contains('no-translate')) {
      return true;
    }
    
    // Check for role="img" (icons, flags, etc.)
    if (element.getAttribute('role') === 'img') {
      return true;
    }
    
    // Check if element or any parent is an SVG
    if (element.closest('svg')) {
      return true;
    }
    
    // Check if element is an image
    if (element.tagName.toLowerCase() === 'img') {
      return true;
    }
    
    return false;
  }
  
  // Check if text contains only emojis or flags
  private isEmojiOrFlagOnly(text: string): boolean {
    // Remove whitespace
    const trimmed = text.trim();
    if (!trimmed) return false;
    
    // Check if text contains only flag emojis (🇺🇸, 🇧🇷, 🇪🇸, etc.)
    const flagRegex = /^[\p{RI}\p{Emoji}]+$/u;
    
    // Check if it's mainly emojis (more than 50% emoji characters)
    const emojiRegex = /[\p{Emoji}\p{RI}]/gu;
    const emojiMatches = trimmed.match(emojiRegex) || [];
    const emojiRatio = emojiMatches.length / trimmed.length;
    
    return flagRegex.test(trimmed) || emojiRatio > 0.5;
  }
}

// Create global instance
export const autoTranslator = new AutoTranslator();

// Hook for React components
export const useAutoTranslate = () => {
  return {
    translate: (text: string, toLang?: string) => 
      autoTranslator.translateText(text, 'pt', toLang || autoTranslator.getCurrentLanguage()),
    setLanguage: (lang: string) => autoTranslator.setLanguage(lang),
    getCurrentLanguage: () => autoTranslator.getCurrentLanguage(),
    translatePage: () => autoTranslator.translatePage()
  };
};
