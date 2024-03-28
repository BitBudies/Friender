import React, { useEffect, useState } from 'react'
import "./Formulario.css"

const Formulario = ({nombre,precio}) => {
  const [formData,setFormData] = useState({
    fecha : '',
    direccion : '',
    hora : '',
    duracion : '',
    descripcion: '',
  });


  const handleSubmit = () => {
    console.log(formData);
  }

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.name] : e.target.value})
  }

  return (
    <div id="formulario">
      <div id="cajaFormularioEncuentro">
        <form id="formularioSolicitud" action="/enviarFormulario.js" method="post">
          <h2>Solicitud de Encuentro</h2>
          <label className="form-label" for="fecha">Fecha</label>
          <input  className="form-input" type="date" id="fecha" name="fecha" 
          placeholder="dd/mm/aa" required 
          value={formData.fecha} onChange={handleChange}/>

          <label for="hora">Hora</label>
          <input type="time" id="hora" name="hora" placeholder="00:00" required
          value={formData.hora} onChange={handleChange}/>

          <label className="en-bloque" for="duracion">Duración (hrs)</label>
          <input type="number" id="duracion" name="duracion" min="1" required
          value={formData.duracion} onChange={handleChange }/>

          <label className="en-bloque" for="direccion">Dirección</label>
          <input type="text" id="direccion" name="direccion" required
          value={formData.direccion} onChange={handleChange }/>

          <label className="en-bloque" for="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" rows="5" cols="50" required
          value={formData.descripcion} onChange={handleChange }></textarea>
        </form>

        <div id="datosPerfilSolicitud">
          <img id="fotoPerfilSolicitud" src="https://cdn-icons-png.flaticon.com/512/552/552721.png" alt="fotoperfilsolicitud"/>
          <p id="texto-nombre" >{nombre}</p>
          <div id="cajaEstrellas" class="estrellas" >★★★☆☆</div>
          <p id="texto-precio" >Total: {precio}bs</p>
          <button id="botonEnviar" type="button" onClick={handleSubmit}>Enviar Solicitud</button>
        </div>

        <img id="icono-cerrar" src="https://cdn.icon-icons.com/icons2/1207/PNG/512/1491313938-close_82982.png" alt="iconoCerrar"/>
      </div>
    </div>
  )
}

export default Formulario