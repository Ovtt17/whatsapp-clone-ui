import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import {KeycloakProvider} from "./modules/auth/keycloak/KeycloakContext.tsx";

function App() {
  return (
    <BrowserRouter>
      <KeycloakProvider>
        <AppRoutes />
      </KeycloakProvider>
    </BrowserRouter>
  )
}

export default App
