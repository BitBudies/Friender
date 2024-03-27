import React, { useEffect } from 'react'
import "./Perfil.css"
import { useGlobalContext } from '../../context'

const Perfil = () => {

    const {userData} = useGlobalContext();

    useEffect(() => {
      console.log(userData)
    },[userData])

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
