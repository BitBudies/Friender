import React,{useEffect, useState} from 'react'
// import { Link, useNavigate } from 'react-router-dom';
import "./Registrarse_2.css";
import { useGetInteresesQuery, useUploadImageMutation } from './authSlice';
// import { useLoginMutation } from './authSlice';
// import { useGlobalContext } from '../../context';

const RegistrarDatos2 = ({setNForm}) => {

    const defaultValues = {
        interes: [],
        fotos: [],
        fotosNombres: [],
        descripcion: '',
        terminos: false,
      };
    
    const {data,isFetching,isSuccess} = useGetInteresesQuery();
    const [descripcionLength, setDescripcionLength] = useState(0); // Estado para longitud de descripción
    const [values, setValues] = useState(defaultValues);

    // para imagenes
    const [clienteId, setClienteId] = useState('');
    const [tipoImagen, setTipoImagen] = useState('');
    const [imagen, setImagen] = useState(null);
    const [send] = useUploadImageMutation();


    // para el select de los intereses
    const checkInteres = () => {
        if (isFetching){
            console.log('Is loading...')
        }
        if (isSuccess){
            const mySelect = document.getElementById('selInteres');
            for (const item of data.intereses) {
                const option = document.createElement('option');
                option.value = item.nombre;
                option.text = item.nombre;
                mySelect.appendChild(option);
              }    
        }
    }

    useEffect(checkInteres,[data, isFetching, isSuccess])
    
    const interesField = (value) => {
        let messageNombre = "";
      
        if (!value.trim()) {
          messageNombre = "Mínimo un interes";
        }
        return messageNombre;
    }
    
    const fotoField = (value) => {
        let messageNombre = "";
      
        if (!value.trim()) {
          messageNombre = "Mínimo 1 foto";
        }
        return messageNombre;
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'descripcion') {
            setDescripcionLength(value.length); // Actualiza la longitud de la descripción
            setValues({
                ...defaultValues,
                [name] : value,
              });
            console.log(values[name])
            // defaultValues.descripcion = value
            // console.log(defaultValues.descripcion)
        }
        if(name === 'selInteres') {
            if (defaultValues.interes.indexOf(value) == -1) {
                defaultValues.interes.push(value)
            }
            // console.log(defaultValues.interes)
            const selectElement = document.getElementById('selInteres');
            selectElement.style.color='#000'  
        }
        if (name === 'input-foto'){
            const element = document.getElementById('input-foto');
            const selectedFile = e.target.files[0];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (['jpg', 'png', 'jpeg'].indexOf(fileExtension) === -1) {
                alert('Solo se permiten archivos JPG, JPEG y PNG.');
                element.value = ''; // Clear the file selection
                return;
            }
            
            setClienteId(1);
            setTipoImagen(fileExtension);
            setImagen(selectedFile);

            const formData = new FormData();
            formData.append('cliente_id', clienteId);
            formData.append('tipoImagen', tipoImagen);
            formData.append('imagen', imagen);

            defaultValues.fotos.push(formData)
            console.log(defaultValues.fotos)

            defaultValues.fotosNombres.push(selectedFile.name)
            // setValues({
            //     ...values,
            //     ['fotos']: selectedFile.name,
            // });
            console.log(defaultValues.fotosNombres);

        }
        if (name === 'checkbox'){
            // setValues({
                // [name] : !values[name]
            // })
            // console.log(values[name])
            defaultValues.terminos = !defaultValues.terminos
            console.log(defaultValues.terminos)
        }
    };

    const rojoClase = descripcionLength < 30 ? 'texto-rojo' : '';

    // useEffect(() => {
    //     console.log(data.intereses,isFetching,isSuccess);
    // },[data,isFetching,isSuccess])


  return (
    <div className="form-item">
        <div className="form-2">
        <div className="toColumns">
                        <section className='interes'>
                            Intereses* <br></br>
                            <select name='selInteres' id='selInteres' onChange={handleChange}>
                                <option value="" disabled selected hidden>Elige tus intereses</option>
                            </select>
                        </section>
                        <section className='fotos'>
                            <p>Fotos*</p>
                            <input type='file' name='input-foto' id='input-foto' onChange={handleChange} accept='.jpg, .png, .jpeg'/>
                        </section>
                    </div>
                    <div className='para-desc'>
                        <p>Descripción*</p>
                        <textarea className='desc-text' placeholder='Una breve descripción' rows="5" cols="90"
                        id='descripcion' name='descripcion' onChange={handleChange} maxLength={500} value={defaultValues.descripcion}></textarea>
                        <p className="text-muted" id="caracteres-minimo">
                            <span className={rojoClase}>
                                {descripcionLength < 30 ? `${descripcionLength}/30 caracteres mínimo.` : ''}
                            </span>
                                {descripcionLength >= 400 && `${descripcionLength}/500 caracteres máximo.`}
                        </p>
                    </div>
                    <div >
                        <input type='checkbox' id = 'checkbox' name='checkbox' onClick={handleChange} /> 
                        <label className="form-label" htmlFor='checkbox'>
                            Aceptar términos y condiciones
                        </label>

                    </div>
                    <div className='para-boton'>
                        <button className='btn  anterior' onClick={() => setNForm(n => n - 1)}>Anterior</button>
                        <button className='btn btn-azul siguiente' type='button'>Registrarse</button>
                    </div>
        </div>
                    
    </div>
  )
}

export default RegistrarDatos2
