import React, { useEffect, useState } from 'react'
import "./Formulario.css"
import { RxCross2 } from "react-icons/rx";
import { useEnviarSolicitudMutation } from './solicitudesSlice';
import {useGlobalContext} from "../../context"

const defaultValues = {
  fecha_inicio : '',
  lugar : '',
  hora_inicio : '',
  duracion : 1,
  descripcion: '',
}


const Formulario = ({amigo_id,precio,showForm,setShowForm,formStatus,setFormStatus}) => {

  const {clientId : cliente_id} = useGlobalContext();
  const [formData,setFormData] = useState(defaultValues);

  const [disableBtn,setDisableBtn] = useState(true);
  const [showFeedback,setShowFeedback] = useState({status : false, message : ""})
  const [send,{data, isLoading,isSuccess,isError,error}] = useEnviarSolicitudMutation();
  const [descripcionLength, setDescripcionLength] = useState(0); // Estado para longitud de descripción



  const handleSubmit = async() => {
    setDisableBtn(true);
    const body = {amigo_id, cliente_id,...formData,precio: formData.duracion * precio}
    await send(body)
  }

  const handleChange = (e) =>{
    const { name, value } = e.target;
    if (name === 'descripcion') {
      setDescripcionLength(value.length); // Actualiza la longitud de la descripción
    }
    setFormData({...formData,[e.target.name] : e.target.value})
  }

  const handleClose = () => {
    setFormData(defaultValues);
    setShowForm(false);
  }

  useEffect(() => {
    console.log(data,isLoading,"form") 
    if(isError){
      setShowFeedback({status: true, message : error.data.error})
      setDisableBtn(false);
      return console.log(error)
    }
   if(isSuccess){
    if(data.mensaje && !formStatus.sent){
      setFormData(() => {
        return {
        fecha_inicio : '',
        lugar : '',
        hora_inicio : '',
        duracion : 1,
        descripcion: ''
      }})

        setShowForm(false);
        setFormStatus({sent : true, message : data.mensaje,show: true})
    }else{
      setShowFeedback({status: true,message : data.error})
    }
    }
    
  },[data, formStatus, isError, isLoading, isSuccess, setFormStatus, setShowForm,error])

  useEffect(() => {
    console.log(formData);
    const isFilled = Object.keys(formData).every(item =>{
      if(item === "descripcion"){
        if(formData[item].length < 30){
          setDisableBtn(true);
          return false
        }
      }
      return formData[item]
    } )
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
            <input  className="form-control" 
            type="date" data-date= "" data-date-format="DD MM YYYY"
            id="fecha" name="fecha_inicio" 
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
            <input className="form-control" type="number" id="duracion" name="duracion" min="1" max="8" required
            value={formData.duracion} onChange={handleChange }/>
          </div>
            <div id="direction-input" className='form-item'>
            <label htmlFor="direccion" className='form-label'>Dirección</label>
            <input className="form-control" type="text" id="direccion" name="lugar" required
            value={formData.lugar} onChange={handleChange }/>
          </div>
        </div>
        <div className='form-item w-100'>
          <label htmlFor="descripcion" className='form-label'>Descripción</label>
          <textarea className="form-control" id="descripcion" name="descripcion" rows="5" cols="50" required
          value={formData.descripcion} onChange={handleChange } maxLength={500}></textarea>
          <p className="text-muted">
            {descripcionLength < 30 ? `${descripcionLength}/30 caracteres mínimo.` : ''}
            {descripcionLength >= 100 && `${descripcionLength}/500 caracteres máximo.`}
          </p>
        </div> 
        {showFeedback.status && <p className='text-danger'>{showFeedback.message}</p>}
        
        <div className='form-bottom'>
          <p id="texto-precio" >Total: {precio * formData.duracion} Bs</p>
          <button className={`btn btn-azul ${disableBtn && "disabled"}`} 
          type="button" 
          onClick={handleSubmit}
          >Enviar Solicitud</button>
        </div>
        </form>
        <div className='close-icon' onClick={handleClose}><span><RxCross2/></span></div>
      </div>
    </div>
  )
}

export default Formulario