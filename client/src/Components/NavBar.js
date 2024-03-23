import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className='navbar bg-azul-fuerte text-light '>
      <div className='container-fluid '>
        <Link to={"/"} className='navbar-brand text-light'>Friender</Link>
      </div>
    </nav>
  )
}

export default NavBar
