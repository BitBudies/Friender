import { useGlobalContext } from '../context'

const useIsAuthenticated = () => {
const {clientId} = useGlobalContext();
  return !(clientId === '0') 
}

export default useIsAuthenticated
