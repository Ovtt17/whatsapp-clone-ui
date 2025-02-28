import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import { KeycloakProvider } from "./modules/auth/keycloak/KeycloakContext.tsx";
import { DefaultLayout } from './layout/DefaultLayout';

function App() {
  return (
    <BrowserRouter>
      <KeycloakProvider>
        <DefaultLayout>
          <AppRoutes />
        </DefaultLayout>
      </KeycloakProvider>
    </BrowserRouter>
  )
}

export default App
