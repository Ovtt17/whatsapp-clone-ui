import { Route, Routes } from 'react-router-dom';
import Home from "../pages/Home/Home.tsx";
import { useKeycloak } from "../modules/auth/keycloak/KeycloakContext.tsx";
import { useEffect } from "react";
import { setupAxiosInterceptors } from "../modules/auth/axios/axiosInstance.ts";

const AppRoutes = () => {
  const { keycloakService, isAuthenticated } = useKeycloak();

  useEffect(() => {
    if (isAuthenticated) {
      setupAxiosInterceptors(keycloakService);
    }
  }, [isAuthenticated, keycloakService]);

  return (
    <Routes>
      <Route path="" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes;