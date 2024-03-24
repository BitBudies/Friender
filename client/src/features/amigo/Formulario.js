import React, { useEffect } from 'react'
import "./Formulario.css"

const Formulario = ({nombre,precio}) => {


  useEffect(() => {
    console.log(nombre,precio);
  },[nombre,precio])
  return (
    <div>
      
    </div>
  )
}

export default Formulario
