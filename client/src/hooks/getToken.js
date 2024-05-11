import { useCookies } from "react-cookie";
const useGetToken = () => {

    const [cookies] = useCookies(["token"]);
    return cookies.token
}

export default useGetToken;