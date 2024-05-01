import { useCookies  } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const useIsAuthenticated = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  return token !== undefined;
};

const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();
  const {clientId} = useGlobalContext();
  console.log(clientId,"clientId")

  return () => {
    if(useIsAuthenticated && clientId !== '0'){
      navigate("/")
    }
  }
  
}

export { useIsAuthenticated, useRedirectIfAuthenticated} ;
