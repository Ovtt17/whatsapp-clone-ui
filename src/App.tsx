import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import { KeycloakProvider } from "./modules/auth/keycloak/KeycloakContext.tsx";
import { DefaultLayout } from './layout/DefaultLayout';
import { ChatProvider } from "./modules/chat/context/ChatContext.tsx";

function App() {
  return (
    <BrowserRouter>
      <KeycloakProvider>
        <DefaultLayout>
          <ChatProvider>
            <AppRoutes />
          </ChatProvider>
        </DefaultLayout>
      </KeycloakProvider>
    </BrowserRouter>
  )
}

export default App
