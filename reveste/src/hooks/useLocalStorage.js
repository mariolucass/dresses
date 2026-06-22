import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Busca o valor inicial do localStorage ou usa o valor padrão fornecido
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler chave "${key}" do localStorage:`, error);
      return initialValue;
    }
  });

  // Atualiza o localStorage sempre que o estado mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar chave "${key}" no localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}