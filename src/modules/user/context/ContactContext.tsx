import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { UserResponse } from '@/modules/user/types/UserResponse.ts';
import { getAllUsers } from '@/modules/user/types/services/userService.ts';

interface ContactContextProps {
  contacts: UserResponse[];
  searchNewContact: boolean;
  setSearchNewContact: Dispatch<SetStateAction<boolean>>;
  searchContact: () => Promise<void>;
}

const ContactContext = createContext<ContactContextProps | undefined>(undefined);

export const ContactProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<UserResponse[]>([]);
  const [searchNewContact, setSearchNewContact] = useState<boolean>(false);

  const searchContact = async () => {
    const allContacts = await getAllUsers();
    setContacts(allContacts);
    setSearchNewContact(true);
  }

  return (
    <ContactContext.Provider value={{ contacts, searchNewContact, setSearchNewContact, searchContact }}>
      {children}
    </ContactContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
}