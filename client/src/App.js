import React, { useEffect } from 'react';
import ListaAmigos from './features/amigo/ListaAmigos';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import PerfilAmigo from './features/amigo/PerfilAmigo';
import LogIn from './features/autenticacion/LogIn';
import Default from './Pages/Default';
import Perfil from './features/cliente/Perfil';
import { useGetClienteByIdQuery } from './features/cliente/clienteSlice';
import Loading from './Components/Loading';
import { useGlobalContext } from './context';
import SolicitudDetalles from './features/solicitudes/SolicitudDetalles';
import Alert from './Components/Alert';
import Jhon from './features/Test/Jhon';
import Registrarse from './features/autenticacion/Registrarse';
import useIsAuthenticated from './hooks/isAuthenticated';
import ResetPassword from './features/autenticacion/resetPassword';
import RecuperarCuenta from './features/autenticacion/RecuperarCuenta';


function App() {
  const {clientId,setUserData} = useGlobalContext();

  const {data,isFetching,isUninitialized} = useGetClienteByIdQuery(clientId);

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if(isAuthenticated){
      if(!isFetching && !isUninitialized){
        setUserData(data)    
      }
    }
    
  },[data, isAuthenticated, isFetching, isUninitialized, setUserData])

  if(isFetching){
    return <Loading/>
  }else{
    return (
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/amigos/page/:n_page' element={<ListaAmigos/>}/>
          <Route path='/amigos/:id_amigo' element={<PerfilAmigo/>}/>
          <Route path='/login' element= {<LogIn/>}/>
          <Route path='/perfil' element={<Perfil/>}/>
          <Route path='/usuario/solicitud_pendiente/:id_solicitud' element={<SolicitudDetalles/>}/>
          <Route path="/test/jhon" element={<Jhon/>} />
          <Route path="/resetPassword" element={<ResetPassword/>}/>
          <Route path="/registrar" element={<Registrarse/>}/>
          <Route path="/recuperar" element={<RecuperarCuenta/>}/>
          <Route path='/*' element={<Default/>}/>
        </Routes>
        <Alert/>
      </Router>
    );
  }
}

export default App;