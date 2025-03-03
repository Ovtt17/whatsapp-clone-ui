import { Route, Routes } from 'react-router-dom';
import Home from "../pages/Home/Home.tsx";
import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext.tsx';

const AppRoutes = () => {
  const { isAuthenticated } = useKeycloak();
  return isAuthenticated && (
    <Routes>
      <Route path="" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes;