import React, {  useState } from 'react'
import "./Formulario.css"
import { RxCross2 } from "react-icons/rx";


const Formulario = ({nombre,precio,showForm,setShowForm}) => {
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
    <div className={`formulario ${!showForm && "hide"}`}>
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
        <div className='form-bottom'>
          <p id="texto-precio" >Total: {precio} $us</p>
          <button className='btn btn-azul' type="button" onClick={handleSubmit}>Enviar Solicitud</button>
        </div>
        </form>

        {/* <div id="datosPerfilSolicitud">
          <p id="texto-nombre" >{nombre}</p>
          <div id="cajaEstrellas" class="estrellas" >★★★☆☆</div>
          
        </div> */}
        <div className='close-icon' onClick={() => setShowForm(false)}><span><RxCross2/></span></div>

      </div>
    </div>
  )
}

export default Formulario