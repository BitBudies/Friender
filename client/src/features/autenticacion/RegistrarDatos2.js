import React,{useEffect, useState} from 'react'
// import { Link, useNavigate } from 'react-router-dom';
import "./Registrarse_2.css";
import { useGetInteresesQuery } from './authSlice';
// import { useLoginMutation } from './authSlice';
// import { useGlobalContext } from '../../context';

const RegistrarDatos2 = ({setNForm}) => {

    
    const {data,isFetching,isSuccess} = useGetInteresesQuery();
    const [descripcionLength, setDescripcionLength] = useState(0); // Estado para longitud de descripción

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'descripcion') {
            setDescripcionLength(value.length); // Actualiza la longitud de la descripción
        }
        if(name === 'intereses') {
            
        }
        if(name === 'fotos'){
            // console.log(formData.fecha_inicio);
            // console.log(value.length);
            // if(value.length > 10){
            //     setFormData({...formData,fecha_inicio : formData.fecha_inicio});
            //     return;
            // }
        }
        // setFormData({...formData, [name]: value});
    };

    const rojoClase = descripcionLength < 30 ? 'texto-rojo' : '';

    // useEffect(() => {
    //     console.log(data.intereses,isFetching,isSuccess);
    // },[data,isFetching,isSuccess])


  return (
    <div className="form-item">
                    <div className="toColumns">
                        <section className='interes'>
                            Intereses* <br></br>
                            <select name='interes' >
                                <option value="" disabled selected hidden>Elige tus intereses</option>
                                <option>Esto es prueba</option>
                            </select>
                        </section>
                        <section className='fotos'>
                            Fotos*
                        </section>
                    </div>
                    <div className='para-desc'>
                        <p>Descripción*</p>
                        <textarea className='desc-text' placeholder='Una breve descripción' rows="5" cols="90"
                        id='descripcion' name='descripcion' onChange={handleChange } maxLength={500}></textarea>
                        <p className="text-muted" id="caracteres-minimo">
                            <span className={rojoClase}>
                                {descripcionLength < 30 ? `${descripcionLength}/30 caracteres mínimo.` : ''}
                            </span>
                                {descripcionLength >= 400 && `${descripcionLength}/500 caracteres máximo.`}
                        </p>
                    </div>
                    <div >
                        <input type='checkbox' id = 'checkbox'/> 
                        <label className="form-label" htmlFor='checkbox'>
                            Aceptar términos y condiciones
                        </label>

                    </div>
                    <div className='para-boton'>
                        <button className='anterior' onClick={() => setNForm(n => n - 1)}>Anterior</button>
                        <button className='siguiente' type='button'>Registrarse</button>
                    </div>
                </div>
  )
}

export default RegistrarDatos2
