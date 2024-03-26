import React from 'react';
import ListaAmigos from './features/amigo/ListaAmigos';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import PerfilAmigo from './features/amigo/PerfilAmigo';
import { generateMockFriends } from './hooks/mockFriend';
import LogIn from './features/autenticacion/LogIn';
import Default from './Pages/Default';



function App() {
  generateMockFriends(30);

  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/amigos' element={<ListaAmigos/>}/>
        <Route path='/amigos/:id_amigo' element={<PerfilAmigo/>}/>
        <Route path='/login' element= {<LogIn/>}/>
        <Route path='/*' element={<Default/>}/>
      </Routes>
    </Router>
  );
}

export default App;
