import React, { useEffect } from 'react';
import ListaAmigos from './features/amigo/ListaAmigos';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import PerfilAmigo from './features/amigo/PerfilAmigo';
import LogIn from './features/autenticacion/LogIn';
import Default from './Pages/Default';
import Perfil from './features/cliente/Perfil';
import MiPerfil from './Components/MiPerfil/MiPerfil';
import { useGetClienteByIdQuery } from './features/cliente/clienteSlice';
import Loading from './Components/Loading';
import { useGlobalContext } from './context';
import SolicitudDetalles from './features/solicitudes/SolicitudDetalles';
import Alert from './Components/Alert';
import Jhon from './features/Test/Jhon';
import Registrarse from './features/autenticacion/Registrarse';
import {useIsAuthenticated} from './hooks/isAuthenticated';
import ResetPassword from './features/autenticacion/resetPassword';
import RecuperarCuenta from './features/autenticacion/RecuperarCuenta';
import { RegistrarDatos15 } from './features/autenticacion/RegistrarDatos15';
import {DayezaPractica} from './features/autenticacion/DayezaPractica';
import NewPassword from './features/autenticacion/newPassword'
import { Cookies } from 'react-cookie';
import { useGetClienteInfoQuery } from './features/cliente/clienteSlice';
import { useCookies } from "react-cookie";
import PerfilCliente from './features/cliente/PerfilCliente';
import SolicitudesAceptadas from './features/solicitudes/SolicitudesAceptadas';
import useGetToken from './hooks/getToken';
import SolicitudDetalle from './Components/CartSolicitudesAccept/SolicitudDetalle';
import { useIsEnabledFriendModeQuery } from './features/cliente/clienteSlice';


function App() {


  const token = useGetToken();
  const {clientId,setUserData,setClientId} = useGlobalContext();

  const {
    data,
    isFetching,
    isUninitialized
  } = useGetClienteInfoQuery(token);


  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if(isAuthenticated){
      if(!isFetching && !isUninitialized){
        setUserData(data)  
        // setIsFriendModeEnabled(isEnabled.data)
      }
    }
    
  },[data, isAuthenticated, isFetching, isUninitialized, setUserData, clientId, setClientId]) //setIsFriendModeEnabled, isEnabled.data

  if(isFetching){
    return <Loading/>
  }else{
    return (
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/amigos' element={<ListaAmigos/>}/>
          <Route path='/amigos/:id_amigo' element={<PerfilAmigo/>}/>
          <Route path='/cliente/:id_cliente' element={<PerfilCliente/>}/>
          <Route path='/new-password/:tokencito' element={<NewPassword/>}/>
          <Route path='/login' element= {<LogIn/>}/>
          <Route path='/cuenta-amigo' element={<Perfil/>}/>
          <Route path='/miperfil' element={<MiPerfil/>}/>
          <Route path='/usuario/solicitud_pendiente/:id_solicitud' element={<SolicitudDetalles/>}/>
          <Route path="/test/jhon" element={<Jhon/>} />
          <Route path="/resetPassword" element={<ResetPassword/>}/>
          <Route path="/registrar" element={<Registrarse/>}/>
          <Route path="/aceptadas" element={<SolicitudesAceptadas/>}/>
          <Route path="/recuperar" element={<RecuperarCuenta/>}/>
          <Route path="/practica" element={<DayezaPractica/>}/>
          <Route path='/usuario/solicitud_aceptada/:id_solicitud' element={<SolicitudDetalle/>}/>
          <Route path='/*' element={<Default/>}/>
        </Routes>
        <Alert/>
      </Router>
    );
  }
}

export default App;