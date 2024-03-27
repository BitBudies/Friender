import React from 'react'
import "./Perfil.css"

const Perfil = () => {
    return (
      <div className='page'>
          <div className='profile-section'>
              <div className='profile-options'>
                  <div className='profile-info'>
                      <div className='profile-image'>
                      <div 
                      className='image' 
                      style={{backgroundImage:"url(/images/user.jpeg)"}}></div>
                      </div>
                      <h4>Kevin Huayllas Pinto</h4>
                  </div>
              </div>
              <div className='profile-content'></div>
          </div>
      </div>
      
    )  
}

export default Perfil
