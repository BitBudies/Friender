import React, {  useEffect, useState } from 'react'
import "./Formulario.css"
import { RxCross2 } from "react-icons/rx";
import { useEnviarSolicitudMutation } from './solicitudesSlice';
import {useGlobalContext} from "../../context"


const Formulario = ({amigo_id,precio,showForm,setShowForm,formStatus,setFormStatus}) => {

  const {clientId : cliente_id} = useGlobalContext();
  const [formData,setFormData] = useState({
    fecha_inicio : '',
    lugar : '',
    hora_inicio : '',
    duracion : 1,
    descripcion: '',
  });

  const [disableBtn,setDisableBtn] = useState(true);
  

  const [send,{data, isLoading,isSuccess}] = useEnviarSolicitudMutation();



  const handleSubmit = async() => {
    setDisableBtn(true);
    const body = {amigo_id, cliente_id,...formData}
      await send(body)
  }

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.name] : e.target.value})
  }

  useEffect(() => {
    console.log(data,isLoading)
   if(isSuccess){
      setFormData(() => {
      return {
      fecha_inicio : '',
      lugar : '',
      hora_inicio : '',
      duracion : 1,
      descripcion: ''
    }})

      setShowForm(false);
      setFormStatus({sent : true, message : "Enviado exitosamente"})
    }
    
  },[data, isLoading, isSuccess, setFormStatus, setShowForm])

  useEffect(() => {
    const isFilled = Object.keys(formData).every(item => formData[item])
    if(isFilled){
      setDisableBtn(false);
    }
  },[formData])

  return ( 
    <div className={`formulario ${!showForm && "hide"}`}>
      <div id="cajaFormularioEncuentro">
      
        <form className='application-form'>
        <h2>Solicitud de Encuentro</h2>
        <div className='form-box'>
          <div className='form-item'>
            <label className="form-label" htmlFor="fecha">Fecha</label>
            <input  className="form-control" type="date" id="fecha" name="fecha_inicio" 
            placeholder="dd/mm/aa" required 
            value={formData.fecha_inicio} onChange={handleChange}/>
          </div>
          <div className='form-item'>
            <label htmlFor="hora" className='form-label'>Hora</label>
            <input className="form-control" type="time" id="hora" name="hora_inicio" placeholder="00:00" required
            value={formData.hora_inicio} onChange={handleChange}/>
          </div>
        </div>
        <div className='form-box'>
          <div id="duration-input" className='form-item'>
            <label htmlFor="duracion" className='form-label'>Duración (hrs)</label>
            <input className="form-control" type="number" id="duracion" name="duracion" min="1" required
            value={formData.duracion} onChange={handleChange }/>
          </div>
            <div id="direction-input" className='form-item'>
            <label htmlForor="direccion" className='form-label'>Dirección</label>
            <input className="form-control" type="text" id="direccion" name="lugar" required
            value={formData.lugar} onChange={handleChange }/>
          </div>
        </div>
        <div className='form-item w-100'>
          <label for="descripcion" className='form-label'>Descripción</label>
          <textarea className="form-control" id="descripcion" name="descripcion" rows="5" cols="50" required
          value={formData.descripcion} onChange={handleChange }></textarea>
        </div> 
        <div className='form-bottom'>
          <p id="texto-precio" >Total: {precio * formData.duracion} $us</p>
          <button className={`btn btn-azul ${disableBtn && "disabled"}`} 
          type="button" 
          onClick={handleSubmit}
          >Enviar Solicitud</button>
        </div>
        </form>
        <div className='close-icon' onClick={() => setShowForm(false)}><span><RxCross2/></span></div>
      </div>
    </div>
  )
}

export default Formulario