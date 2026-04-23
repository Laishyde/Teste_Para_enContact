import { useState, useEffect } from "react";
import { UseFetchResult } from "../types";

/**
 * Hook customizado para gerenciar chamadas de API
 * Fornece estado de carregamento, dados e erro para requisições assíncronas
 * 
 * @template T - Tipo dos dados retornados pela API
 * @param fetchFunction - Função assíncrona que busca os dados
 * @param deps - Array de dependências para re-executar a requisição
 * @returns Objeto com dados, estado de carregamento e erro
 */
export const useFetch = <T,>(
  fetchFunction: () => Promise<T>,
  deps: any[] = []
): UseFetchResult<T> => {
  // Estado para armazenar os dados retornados pela API
  const [data, setData] = useState<T | null>(null);
  
  // Estado para controlar se a requisição está em andamento
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estado para armazenar possíveis erros da requisição
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Flag para controlar se o componente ainda está montado
    // Evita tentativas de atualizar estado em componentes desmontados
    let isMounted = true;

    // Função assíncrona para executar a requisição
    const fetchData = async () => {
      try {
        // Inicia o estado de carregamento
        setLoading(true);
        setError(null);

        // Executa a função de busca de dados
        const result = await fetchFunction();
        
        // Atualiza o estado apenas se o componente ainda estiver montado
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        // Trata erros e atualiza o estado apenas se o componente ainda estiver montado
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        }
      } finally {
        // Finaliza o estado de carregamento apenas se o componente ainda estiver montado
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Executa a busca de dados
    fetchData();

    // Função de limpeza para marcar que o componente foi desmontado
    return () => {
      isMounted = false;
    };
  }, deps); // Array de dependências controla quando o efeito será re-executado

  return { data, loading, error };
};