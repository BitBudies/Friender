import React, { useEffect } from 'react'
import "./Formulario.css"

const Formulario = ({nombre,precio}) => {


  useEffect(() => {
    console.log(nombre,precio);
  },[nombre,precio])
  return (
    <div id="formulario">
      <h1>HOLA MUNDO</h1>
    </div>
  )
}

export default Formulario
