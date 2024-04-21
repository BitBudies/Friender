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

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'descripcion') {
      setDescripcionLength(value.length); // Actualiza la longitud de la descripción
    }
    if(name === 'duracion') {
      if(value > 8){
        value = 8;
      }
      if(value < 0){
        value = 0;
      }
    }

    if(name === 'fecha_inicio'){
      console.log(formData.fecha_inicio);
      console.log(value.length);
      if(value.length > 10){
        setFormData({...formData,fecha_inicio : formData.fecha_inicio});
        return;
      }
    }
    setFormData({...formData, [name]: value});
  };
  
  const fechaValida = (value) => {
    const selectedDate = new Date(value);
    const currentDate = new Date();
    let messageFecha="";
    
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 14);

    if (selectedDate < currentDate) {
      messageFecha = "La fecha " + formatFecha(value) + " no es válida";
    } else if(selectedDate >= futureDate ){
      messageFecha = "La fecha no debe pasar los 14 dias";
    }
    return messageFecha;
  }

  function formatFecha(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

  const duracionValida = (value) => {
    let messageDuracion="";
    if (value > 8) {
      messageDuracion = "La duración máxima permitida es de 8 horas";
    }
    return messageDuracion;
  }

  const handleClose = () => {
    setFormData(defaultValues);
    setShowForm(false);
    setShowFeedback({status: false,message : ""});
    setDescripcionLength(0);
    setDisableBtn(true);
  }

  const rojoClase = descripcionLength < 30 ? 'texto-rojo' : '';

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
      if(item === "duracion"){
        if(formData[item] === '0'){
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
          <div className='form-item-alquilar'>
            <label className="form-label" htmlFor="fecha">Fecha</label>
            <input  className="form-control" 
            type="date" data-date= "" data-date-format="DD MM YYYY"
            id="fecha" name="fecha_inicio" 
            placeholder="dd/mm/aa" required 
            value={formData.fecha_inicio} onChange={handleChange}/>
            <p className='text-danger'>{fechaValida(formData.fecha_inicio)}</p>
          </div>
          <div className='form-item-alquilar'>
            <label htmlFor="hora" className='form-label'>Hora</label>
            <input className="form-control" type="time" id="hora" name="hora_inicio" placeholder="00:00" required
            value={formData.hora_inicio} onChange={handleChange}/>
          </div>
        </div>
        <div className='form-box'>
          <div id="duration-input" className='form-item-alquilar'>
            <label htmlFor="duracion" className='form-label'>Duración (hrs)</label>
            <input className="form-control" type="number" id="duracion" name="duracion" min="1" max="8" required
            value={formData.duracion} onChange={handleChange }/>
            <p className='text-danger'>{duracionValida(formData.duracion)}</p>
          </div>
            <div id="direction-input" className='form-item-alquilar'>
            <label htmlFor="direccion" className='form-label'>Dirección</label>
            <input className="form-control" type="text" id="direccion" name="lugar" required
            value={formData.lugar} onChange={handleChange }/>
          </div>
        </div>
        <div className='form-item-alquilar w-100'>
          <label htmlFor="descripcion" className='form-label'>Descripción</label>
          <textarea className="form-control" id="descripcion" name="descripcion" rows="5" cols="50" required
          value={formData.descripcion} onChange={handleChange } maxLength={500}></textarea>
          <p className="text-muted" id="caracteres-minimo">
          <span className={rojoClase}>
      {descripcionLength < 30 ? `${descripcionLength}/30 caracteres mínimo.` : ''}
    </span>
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