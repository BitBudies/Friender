import { createContext, useContext, useState,useEffect } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [clientId, setClientId] = useState('1');
  const [userData,setUserData] = useState({});
  const [alert,setAlert] = useState({status: false, message: 'Mensaje de prueba',type : 'success'});
  

  const showAlert = ({message,type}) => {
    setAlert({status:true,message,type})

    setTimeout(() => {
      setAlert({status: false, message: '',})
    },[3000])
  }

   useEffect(() => {
    console.log(userData);
  },[userData])

  return (
    <AppContext.Provider value={{ clientId, setClientId,userData,setUserData,alert,showAlert }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
