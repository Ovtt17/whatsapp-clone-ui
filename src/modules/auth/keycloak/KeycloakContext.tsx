import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import keycloakService from "./KeycloakService.ts";

interface KeycloakContextProps {
  keycloakService: typeof keycloakService;
  isAuthenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(undefined);

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initKeycloak = async () => {
      const authenticated = await keycloakService.init();
      setIsAuthenticated(authenticated);
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
  const context  = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
};