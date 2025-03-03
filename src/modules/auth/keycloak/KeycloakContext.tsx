import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { setupAxiosInterceptors } from '../axios/axiosInstance.ts';
import { KeycloakService } from './KeycloakService.ts';

interface KeycloakContextProps {
  keycloakService: KeycloakService;
  isAuthenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(undefined);

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  const keycloakService = useMemo(() => new KeycloakService(), []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initKeycloak = async () => {
      if (!keycloakService) return;
      const authenticated = await keycloakService.init();
      setIsAuthenticated(authenticated);
      setupAxiosInterceptors(keycloakService);
    };
    initKeycloak()
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloakService, isAuthenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};