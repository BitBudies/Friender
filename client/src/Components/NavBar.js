import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import "./NavBar.css"
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const NavBar = () => {

  const location = useLocation();
  
  const handleAmigosClick = (event) => {
    if (location.pathname === '/amigos') {
      event.preventDefault();
      window.location.reload();
    }
  };
  return (
    <nav className='navbar navbar-expand-md bg-azul-fuerte text-light' data-bs-theme="dark">
      <div className='container-fluid px-lg-5 py-0'>
        <Link to={"/"} className='navbar-brand'>Friender</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
        <div className='collapse navbar-collapse d-lg-flex justify-content-between' id="navbarSupportedContent">
          <ul className='navbar-nav px-lg-5'>
            <li className='nav-item'>
              <Link to={"/"} className='nav-link'>Home</Link>
            </li>
            <li className='nav-item'>
             <NavLink to="/amigos" className='nav-link' activeClassName='active-link' onClick={handleAmigosClick}>Buscar Amigos</NavLink>
             </li>
          </ul>
          <div className='nav-item dropdown '>
            <span className="nav-link dropdown-toggle profile-icon" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i><FaUserCircle/></i>
            </span>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to={"/acerca"}>Acerca De</Link></li>
              <li><Link className="dropdown-item" to={"/perfil"}>Mi Perfil</Link></li>
              <li><hr className="dropdown-divider"/></li>
              <li><button className="dropdown-item ">Cerrar Sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
