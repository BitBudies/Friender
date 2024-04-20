import React,{useEffect, useState} from 'react'
import "./Registrarse_2.css";
import { useGetInteresesQuery, useUploadImageMutation } from './authSlice';


const RegistrarDatos2 = ({setNForm}) => {

    const defaultValues = {
        interes: [],
        fotos: [],
        // fotosNombres: [],
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
            setValues((currentValues) => {
                return {
                    ...currentValues,
                    [name] : value,
                }
                
              });
        }
        if(name === 'selInteres') {
            if (values.interes.indexOf(value) === -1) {
                setValues({...values,interes : [...values.interes,value]})
            }
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
            
            setTipoImagen(fileExtension);
            setImagen(selectedFile);

           

            setValues({...values,fotos : [...values.fotos,selectedFile]})

        }
    };

    const rojoClase = descripcionLength < 30 ? 'texto-rojo' : '';

    useEffect(() => {
        console.log(values);
    },[values])
  return (
    <div className="form-item">
      <div className="form-2">
        <div className="toColumns">
          <section className="interes">
            Intereses* <br></br>
            <select
              className="form-select"
              name="selInteres"
              id="selInteres"
              onChange={handleChange}
            >
              <option value="" disabled selected hidden>
                Elige tus intereses
              </option>
            </select>
          </section>
          <section className="fotos">
            <p>Fotos*</p>
            <input
              className="form-control"
              type="file"
              name="input-foto"
              id="input-foto"
              onChange={handleChange}
              accept=".jpg, .png, .jpeg"
            />
          </section>
        </div>
        <div className="para-desc">
          <p>Descripción*</p>
          <textarea
            className="form-control"
            placeholder="Una breve descripción"
            rows="5"
            cols="90"
            id="descripcion"
            name="descripcion"
            onChange={handleChange}
            maxLength={500}
            value={values.descripcion}
          ></textarea>
          <p className="text-muted" id="caracteres-minimo">
            <span className={rojoClase}>
              {descripcionLength < 30
                ? `${descripcionLength}/30 caracteres mínimo.`
                : ""}
            </span>
            {descripcionLength >= 400 &&
              `${descripcionLength}/500 caracteres máximo.`}
          </p>
        </div>
        <div>
          <input
            type="checkbox"
            id="checkbox"
            name="checkbox"
            onClick={() => setValues((currentValues) => {return {...currentValues,terminos : !currentValues.terminos}} )}
          />
          <label className="form-label" htmlFor="checkbox">
            Aceptar términos y condiciones
          </label>
        </div>
        <div className="para-boton">
          <button
            className="btn btn-outline-primary anterior"
            onClick={() => setNForm((n) => n - 1)}
          >
            Anterior
          </button>
          <button className="btn btn-azul siguiente" type="button">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

// const formData = new FormData();
// formData.append('imagen', imagen);

// console.log(formData);

export default RegistrarDatos2
