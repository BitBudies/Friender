import React,{useEffect, useState} from 'react'
// import { Link, useNavigate } from 'react-router-dom';
import "./Registrarse_2.css";
// import { useLoginMutation } from './authSlice';
// import { useGlobalContext } from '../../context';
import { PiPersonSimpleThrowBold } from "react-icons/pi";

const Registrarse_2 = () => {

    const getInteres = ['']
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

    return (
        <div className="page regist">
            <div class="left">
                <h1 className='mb-4'><b>Friender</b></h1>
                <p>¡Enciende la diversión con Friender!</p>
                <p>Alquila amigos y crea momentos
                inolvidables.</p>
                <img className="logo-img" src="https://cdn-icons-png.flaticon.com/512/7081/7081305.png" alt="icono-friender"></img>
            </div>

            <div className="right">
                <h1 className='mb-5'>Regístrate</h1>
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
                    <button className='anterior'>Anterior</button>
                    <button className='siguiente' type='button'>Registrarse</button>
                </div>
                        
                
            </div>
        </div>
    )
}

export default Registrarse_2