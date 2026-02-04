import { createContext, useContext, useState } from 'react';

interface UserContextType {
  oracleId: string | null;
  setOracleId: React.Dispatch<React.SetStateAction<string | null>>;
  switchAccount: () => void;
}
/*
 * This context provides a way to share the oracleId entere by user in Login page across the application
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [oracleId, setOracleId] = useState<string | null>(null);

  const switchAccount = () => setOracleId(null);

  return (
    <UserContext.Provider value={{ oracleId, setOracleId, switchAccount }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
