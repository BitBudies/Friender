import React,{useEffect, useState} from 'react'
import "./Registrarse_2.css";
import { useGetInteresesQuery, useUploadImageMutation, useGetCsrfQuery } from './authSlice';
import { LiaFileUploadSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';

import Foto from "../../Components/imagRegistro/test";

const RegistrarDatos2 = ({setNForm, data : info, setPreview}) => {

    const defaultValues = {
        interes: [],
        descripcion: '',
        terminos: false,
      };
    
    const navigate = useNavigate();

    const {data,isFetching,isSuccess} = useGetInteresesQuery();
    const [descripcionLength, setDescripcionLength] = useState(0); // Estado para longitud de descripción
    const [values, setValues] = useState(defaultValues);
    const [pLabels, setPLabels] = useState(false)
    const [pFotos, setPFotos] = useState(false)
    const [fotos, setFotos] = useState([])
    const [validating, setValidatig] = useState(false)
    const [pesado, setPesado] = useState(false)
    const [formato, setFormato] = useState(false)
    

    // para imagenes
    const [send, {data: respuesta, isFetching: carganding, isSuccess: correctito, isError: errorsito, error: responseerror}] = useUploadImageMutation();

    // para el select de los intereses
    const checkInteres = () => {
        if (isFetching){
            console.log('Is loading...')
        }
        if (isSuccess){
            const mySelect = document.getElementById('selInteres');
            for (const item of data) {
                const option = document.createElement('option');
                option.value = item.nombre;
                option.text = item.nombre;
                mySelect.appendChild(option);
              }    
        }
    }

    useEffect(checkInteres,[data, isFetching, isSuccess])
    

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
                setPLabels(true);
                setValues((currentValues) => {
                    return {
                        ...currentValues,
                        interes : [...currentValues.interes, value]
                    }
                });
                const container = document.getElementById('para-labels'); 
                const element = document.createElement('div');
                element.innerHTML = `
                    <strong> ${value} </strong>
                `;
                element.onclick = () => {element.remove()};
                container.appendChild(element);
            }
        }
        if (name === 'input-foto'){
            setPesado(false)
            setFormato(false)

            try {
              if (fotos.length === 6) {
                return;
              }
              const selectedFile = e.target.files[0];
              const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
              if (['jpg', 'png', 'jpeg'].indexOf(fileExtension) === -1) {
                  setFormato(true)
                  return;
              }
              if (selectedFile.size > 205000){
                  setPesado(true)
                  return;
              }

              const fotoURL = URL.createObjectURL(selectedFile)

              setPFotos(true)

              setFotos([...fotos, {id:selectedFile.name, file:selectedFile, url: fotoURL}]);
            } catch  (error) {
              console.log("Debe ingresar una imagen")
            }
        }
    };

    const rojoClase = descripcionLength < 30 || descripcionLength > 400? 'texto-rojo' : '';
    const rojoClaseFoto = fotos.length === 0 || fotos.length === 6 ? 'texto-rojo' : '';
    const rojoClasePesoMax = pesado ? 'texto-rojo' : '';

    useEffect(() => {
        console.log(values);
    },[values])

    
    
    
    // @kevin huayllas pinto hay que usar el csrf en todos los post
    const {data: csrf, error, isLoading } = useGetCsrfQuery({})
    useEffect(() => {
      if (csrf) {
        document.cookie = `csrftoken=${csrf.csrf_token}; path=/;`;
      }
    }, [csrf]);

    const mandarrr = async () => {
      setValidatig(true)
      const form = new FormData();
      form.append("nombre", info.nombre);
      form.append("ap_paterno", info.apellido_paterno);
      form.append("ap_materno", info.apellido_materno);
      form.append("ci", "12345678");
      form.append("fecha_nacimiento", info.fecha_nacimiento);
      form.append("genero", info.genero);
      form.append("direccion", info.ubicacion);
      form.append("descripcion", "descripcion de jhon");
      form.append("usuario", info.nombre_usuario);
      form.append("correo", info.correo_electronico);
      form.append("contrasena", info.contraseña);
      // Corregir esto de las fotos
      fotos.forEach((it) => {
        form.append("imagenes", it.file)
      })
      values.interes.forEach((it) => {
        form.append("intereses", it)
      })
      console.log(form)
      send(form);

    }
  
    useEffect(() => { 
      console.log(responseerror,respuesta,carganding,correctito);
      if (correctito){
        navigate('/login')
      }
    }, [carganding, correctito, responseerror, respuesta])

    const remover = (index) => {
      setFotos(fotos => fotos.filter((_, i) => index !== i))
    }

    useEffect(() => {
      console.log("despues ", fotos);
    },[fotos])

  return (
    <div className="form-item popup">
      <div className="form-2 overlay">
        <div className="toColumns">
          <section className="interes">
            <p className='required-label'>Intereses</p>   
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
            <div className='para-labels' id='para-labels'>
                        {/* se llena dinamicamente */}
            </div>
          </section>

          <section className="fotos">
            <p className='required-label'>Fotos</p>
            <div className='div-file'>
              <p id='selec-archivo'>Seleccionar archivo</p>
              <LiaFileUploadSolid size={25} className='upload-icon'/>
              <input
                className="form-control"
                type="file"
                name="input-foto"
                id="input-foto"
                onChange={handleChange}
                accept=".jpg, .png, .jpeg"
              />
            </div>
            <div className='para-fotos' id='para-fotos'>
                  {pFotos ? 
                    fotos.map((picture, index) => {
                      return(
                        <Foto foto={picture.url} remover={remover} index={index} setPreview={setPreview}/>
                      )
                    })
                  : ""}
            </div>
            <p className="text-muted" id="min-max-fotos">
              <span className={rojoClaseFoto}>
                {fotos.length === 0 && validating
                  ? `Mínimo 1 fotografías.`
                  : 
                    fotos.length === 6 &&
                    `Máximo 6 fotografías`
                }
                {formato
                  ? `Sólo se permiten subir imágenes en formato jpg, jpeg, png.`
                  : '' 
                }
              </span>
              <span className={rojoClasePesoMax}>
                {pesado
                  ? `Imágenes de máximo 200kB.`
                  : '' 
                }
              </span>
            </p>

          </section>
        </div>
        <div className="para-desc">
          <p className='required-label'>Descripción</p>
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
                : descripcionLength >= 400 &&
                  `${descripcionLength}/500 caracteres máximo.`}
            </span>
          </p>
        </div>
        {/* <div>
          <input
            type="checkbox"
            id="checkbox"
            name="checkbox"
            onClick={() => setValues((currentValues) => {return {...currentValues,terminos : !currentValues.terminos}} )}
          />
          <label className="form-label" htmlFor="checkbox">
            Aceptar términos y condiciones
          </label>
        </div> */}
        <div className="para-boton">
          <button
            className="btn btn-outline-primary anterior"
            onClick={() => setNForm((n) => n - 1)}
          >
            Anterior
          </button>
          <button className="btn btn-azul siguiente" 
            type="button" 
            onClick={mandarrr}>
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
