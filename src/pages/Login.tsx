import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useApp, useAppActions } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/globals.css';
import logo from '../assets/logo.png'

const Login: React.FC = () => {
  const { state } = useApp();
  const { setLogin, changeTheme } = useAppActions();
  const { language, setLanguage } = useLanguage();
  
  const [email, setEmail] = useState('admin@encontact.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: 'pt' | 'en' | 'es') => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trigger translation when language changes
  useEffect(() => {
    if (window.autoTranslator) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const currentLang = window.autoTranslator.getCurrentLanguage();
        if (currentLang !== language) {
          window.autoTranslator.setLanguage(language);
        } else if (language !== 'pt') {
          window.autoTranslator.translatePage();
        }
      }, 100);
    }
  }, [language]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      setLogin(true);
      setIsLoading(false);
    }, 1000);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div 
          className="card p-8 animate-scale-in"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="eC Logo" 
                className="w-32 h-auto rounded-lg shadow-md"
              />
            </div>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Bem-vindo ao My test para a enContact
            </h1>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Minha avaliação profissional
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label 
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Email
              </label>
              <div className="relative">
                <Mail 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder={language === 'pt' ? 'seu@email.com' : 'your@email.com'}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label 
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Senha
              </label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder={language === 'pt' ? 'Digite sua senha' : 'Enter your password'}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="btn btn-primary w-full btn-lg"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Opções de Tema e Idioma */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn btn-ghost btn-sm flex items-center gap-1"
                aria-label="Change language"
              >
                <Globe size={16} />
                <span className="text-xs uppercase" data-no-translate="true">
                  {languages.find(lang => lang.code === language)?.flag || '🌐'}
                </span>
                <ChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[150px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as 'pt' | 'en' | 'es')}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span data-no-translate="true">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={changeTheme} 
              className="btn btn-ghost btn-sm"
            >
              {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Link para ajuda */}
          <div className="text-center mt-6">
            
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p 
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            © 2026 Azume teste para enContact. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
