import { createContext, useContext, useState,useEffect } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [clientId, setClientId] = useState('1');
  const [userData,setUserData] = useState({})
  

   useEffect(() => {
    console.log(userData);
  },[userData])

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
