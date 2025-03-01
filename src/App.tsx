import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import { KeycloakProvider } from "./modules/auth/keycloak/KeycloakContext.tsx";
import { DefaultLayout } from './layout/DefaultLayout';
import CombinedProvider from "./context/CombinedProvider.tsx";

function App() {
  return (
    <BrowserRouter>
      <KeycloakProvider>
        <DefaultLayout>
          <CombinedProvider>
            <AppRoutes />
          </CombinedProvider>
        </DefaultLayout>
      </KeycloakProvider>
    </BrowserRouter>
  )
}

export default App
