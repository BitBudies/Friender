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
      
        <form className='application-form'>
        <h2>Solicitud de Encuentro</h2>
        <div className='form-box'>
          <div className='form-item'>
            <label className="form-label" for="fecha">Fecha</label>
            <input  className="form-control" type="date" id="fecha" name="fecha" 
            placeholder="dd/mm/aa" required 
            value={formData.fecha} onChange={handleChange}/>
          </div>
          <div className='form-item'>
            <label for="hora" className='form-label'>Hora</label>
            <input className="form-control" type="time" id="hora" name="hora" placeholder="00:00" required
            value={formData.hora} onChange={handleChange}/>
          </div>
        </div>
        <div className='form-box'>
          <div id="duration-input" className='form-item'>
            <label htmlFor="duracion" className='form-label'>Duración (hrs)</label>
            <input className="form-control" type="number" id="duracion" name="duracion" min="1" required
            value={formData.duracion} onChange={handleChange }/>
          </div>
            <div id="direction-input" className='form-item'>
            <label for="direccion" className='form-label'>Dirección</label>
            <input className="form-control" type="text" id="direccion" name="direccion" required
            value={formData.direccion} onChange={handleChange }/>
          </div>
        </div>
        <div className='form-item'>
          <label for="descripcion" className='form-label'>Descripción</label>
          <textarea className="form-control" id="descripcion" name="descripcion" rows="5" cols="50" required
          value={formData.descripcion} onChange={handleChange }></textarea>
        </div> 
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