import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('role');
      if (saved) setRoleState(saved);
      setLoading(false);
    })();
  }, []);

  const setRole = async (r) => {
    await AsyncStorage.setItem('role', r);
    setRoleState(r);
  };

  const resetRole = async () => {
    await AsyncStorage.removeItem('role');
    setRoleState(null);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, resetRole, loading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}