import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext';
import { FC } from 'react';
import { FaDoorOpen, FaUser } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

const ChatSidebarOptions: FC = () => {
  const { keycloakService } = useKeycloak();

  const userProfile = () => {
    keycloakService.accountManagement();
  }

  const logout = () => {
    keycloakService.logout();
  }

  return (
    <>
      <div>
        <FaMessage className="h-5 w-5 cursor-pointer" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <FaUser className="h-5 w-5 cursor-pointer" onClick={userProfile} />
        <FaDoorOpen className="h-5 w-5 cursor-pointer" onClick={logout} />
      </div>
    </>
  );
}

export default ChatSidebarOptions;