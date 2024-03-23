import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg bg-azul-fuerte' data-bs-theme="dark">
      <div className='container-fluid py-lg-3 px-lg-5'>
        <Link to={"/"} className='navbar-brand'>Friender</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
        <div className='collapse navbar-collapse' id="navbarSupportedContent">
          <ul className='navbar-nav px-lg-5'>
            <li className='nav-item'>
              <Link to={"/"} className='nav-link'>Home</Link>
            </li>
            <li className='nav-item'>
              <Link to={"/amigos"} className='nav-link'>Buscar Amigos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
