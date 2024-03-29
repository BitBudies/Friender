import React, { useEffect, useState } from 'react'
import "./Perfil.css"
import { useGlobalContext } from '../../context'

const optionsData = [
  {
    id : 1, 
    name : "Editar Perfil", 
    toRender : <div className='editar-perfil'><h1>Editar Perfil</h1></div>},
   {
    id : 2,
    name: 'Ver solicitudes Pendientes',
    toRender: <></>
  },
  {
    id:3,
    name: 'Configuracion',
    toRender: <h1>Configuracion</h1>
  }
]


const Perfil = () => {
    const [currentOption,setCurrentOption] = useState(1);

    const {userData} = useGlobalContext();
    const {nombre_completo} = userData

    useEffect(() => {
      console.log(userData)
    },[userData])

    return (
          <div className='profile-section'>
            <div className='profile-section-center'>
              <div className='profile-options'>
                  <div className='profile-info'>
                    <div className='profile-image'>
                      <div 
                      className='image' 
                      style={{backgroundImage:"url(/images/user.jpeg)"}}></div>
                    </div>
                    <h4>{nombre_completo}</h4>
                  </div>
                  <div className='options'>
                    <ul>
                      {optionsData.map(item => (
                        <li key={item.id} onClick={() => setCurrentOption(item.id)}
                        className={`option ${currentOption === item.id && "active"}`}>
                          <p>{item.name}</p>
                        </li>
                      ))}
                      <li className='option'>
                        <p>Cerrar Sesión</p>
                      </li>
                    </ul>
                  </div>
              </div>
              <div className='profile-content'>
                {optionsData.find(option => option.id === currentOption).toRender}
              </div>
            </div>
          </div>      
    )  
}

export default Perfil
