import { createContext, useContext, useState, useEffect, useRef } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [clientId, setClientId] = useState("0");
  const [userData, setUserData] = useState({});
  const [isFriendModeEnabled, setIsFriendModeEnabled] = useState(false);
  const [friendPrice, setFriendPrice] = useState(0);
  const [alert, setAlert] = useState({
    status: false,
    message: "Mensaje de prueba",
    type: "success",
  });
  const pageRef = useRef();

  const goToBeginning = () => {
    pageRef.current.scrollTop = 0;
  };

  const showAlert = (message, type) => {
    setAlert({ status: true, message, type });

    setTimeout(() => {
      setAlert({ status: false, message: "" });
    }, [3000]);
  };

  useEffect(() => {
    console.log(userData, "userData");
  }, [userData]);

  return (
    <AppContext.Provider
      value={{
        clientId,
        setClientId,
        userData,
        setUserData,
        alert,
        showAlert,
        pageRef,
        goToBeginning,
        isFriendModeEnabled,
        setIsFriendModeEnabled,
        friendPrice,
        setFriendPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
