import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [clientId, setClientId] = useState('1');
  const [userData,setUserData] = useState({})
  

  return (
    <AppContext.Provider value={{ clientId, setClientId,userData,setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
