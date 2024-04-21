import { useGlobalContext } from "../context";
import { useCookies  } from "react-cookie";

const useIsAuthenticated = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  return token !== undefined;
};

export default useIsAuthenticated;
