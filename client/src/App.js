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



function App() {
  
  const {clientId,setUserData} = useGlobalContext();
  const {data,isFetching,isUninitialized} = useGetClienteByIdQuery(clientId);


  useEffect(() => {
    if(!isFetching && !isUninitialized){
      setUserData(data)
    }
  },[data, isFetching, isUninitialized, setUserData])

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
          <Route path='/login' element= {<LogIn/>}/>
          <Route path='/perfil' element={<Perfil/>}/>
          <Route path='/*' element={<Default/>}/>
        </Routes>
      </Router>
    );
  }
  
}

export default App;
