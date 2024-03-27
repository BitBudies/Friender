import React from 'react'
import { Link } from 'react-router-dom'

const Default = () => {
  return (
    <div className='page'>
        <div className='section'>
            <div className='side-section'>
                <h2>Oh, al parecer esta sección aún no existe.</h2>
                <p>Lo sentimos por las inconveniencias, pero estamos trabajando en esto, por favor tenga paciencia.</p>
                <Link to={"/"} className='btn btn-azul'>Volver al inicio</Link>
            </div>
            <div className='side-section'>
                <div className='image' style={{backgroundImage:"url(/images/monos.jpeg)"}}></div>
            </div>
        </div>
    </div>
    
  )
}

export default Default
