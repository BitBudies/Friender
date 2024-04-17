import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import "./NavBar.css"
import { NavLink } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import { useGetNavOptions } from '../hooks/navOptions';

import { useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context';

const NavBar = () => {

  const {goToBeginning} = useGlobalContext();

  // const location = useLocation();
  const navItems = useGetNavOptions();

  const location = useLocation();
  const isActive = location.pathname.startsWith('/amigos/page/');
  // const [activeNav,setActiveNav] = useState(1);
  
  const handleAmigosClick = (event,id) => {
    //  setActiveNav(id);
    //  console.log(id);
    // if (location.pathname === '/amigos' && activeNav === 2) {
    //   event.preventDefault();
    //   window.location.reload();
    // }
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
            {navItems.map((item) => {
              return (
                <li className={`nav-item`} key={item.id}>
                    <NavLink to={item.url} className={`nav-link nav-item ${isActive && item.id === 2 && 'active'}`} onClick={ goToBeginning}>{item.name}</NavLink>
                </li>
              );
            })}
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
