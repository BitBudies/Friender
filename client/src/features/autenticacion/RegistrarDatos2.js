import React,{useEffect, useState} from 'react'
import "./Registrarse_2.css";
import { useGetInteresesQuery, useUploadImageMutation, useGetCsrfQuery } from './authSlice';
import { LiaFileUploadSolid } from "react-icons/lia";


const RegistrarDatos2 = ({setNForm,data : info}) => {

    const defaultValues = {
        interes: [],
        // fotos: [],
        descripcion: '',
        terminos: false,
      };
    
    
    const {data,isFetching,isSuccess} = useGetInteresesQuery();
    const [descripcionLength, setDescripcionLength] = useState(0); // Estado para longitud de descripción
    const [values, setValues] = useState(defaultValues);
    const [pLabels, setPLabels] = useState(false)
    const [pFotos, setPFotos] = useState(false)
    const [previeImage,setPreviewImage] = useState('');
    const [fotos, setFotos] = useState([])
    const [validating, setValidatig] = useState(false)
    const [pesado, setPesado] = useState(false)
    const [formato, setFormato] = useState(false)
    const [contador, setContador] = useState(0)
    

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
            if (fotos.length === 6) {
                return;
            }
            
            const selectedFile = e.target.files[0];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (['jpg', 'png', 'jpeg'].indexOf(fileExtension) === -1) {
                setFormato(true)
                return;
            }
            if (selectedFile.size > 200000){
                setPesado(true)
                return;
            }

            setPFotos(true)
            // setValues({...values,fotos : [...values.fotos,selectedFile]})
            
            const container = document.getElementById('para-fotos'); 
            const reader =  new FileReader();
            
            const divFoto = document.createElement('div');
            divFoto.className = 'x-foto';
            const imageElement = document.createElement('img');
            imageElement.id = 'cFoto';
            reader.onload = function (e) {
                imageElement.src = e.target.result;
                imageElement.alt = 'Imagen'; 
                imageElement.width = '100';
                imageElement.height = '100'; 
                imageElement.onclick = () => previewImageBtn(selectedFile);
                
                const cbuton = document.createElement('button');
                cbuton.className = 'para-cerrar';
                cbuton.id = 'para-cerrar';
                cbuton.textContent = 'X';
                cbuton.onclick = () => {
                  divFoto.remove();
                  console.log(selectedFile.name)
                  }
                divFoto.appendChild(imageElement);
                divFoto.appendChild(cbuton);
            }
          
            reader.readAsDataURL(selectedFile)
            container.appendChild(divFoto);

            setFotos([...fotos, {id:selectedFile.name, file:selectedFile}]);
            console.log(selectedFile)
        }
    };

    const previewImageBtn = (file) => {
      const reader =  new FileReader();
            reader.onload = function (e) {
                setPreviewImage(e.target.result);
            }
            reader.readAsDataURL(file)    
    }

    const rojoClase = descripcionLength < 30 ? 'texto-rojo' : '';
    const rojoClaseFoto = fotos.length === 0 || fotos.length === 6 ? 'texto-rojo' : '';

    useEffect(() => {
        console.log(values);
    },[values])

    useEffect(() => {
        setPLabels(true)
    }, [pLabels])

    useEffect(() => {
        setPFotos(true)
        console.log(values);
    }, [pFotos,values])

    useEffect(() => {
      setFotos(fotos);
      console.log(fotos);
    },[fotos])
    
    
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
        form.append("imagenes", it)
      })
      values.interes.forEach((it) => {
        form.append("intereses", it)
      })
      console.log(form)
      send(form);
    }
  
    useEffect(() => { 
      console.log(responseerror,respuesta,carganding,correctito);
    }, [carganding, correctito, responseerror, respuesta])

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
                        {/* se llena dinamicamente */}
            </div>
            <p className="text-muted" id="min-max-fotos">
              <span className={rojoClaseFoto}>
                {fotos.length === 0 && validating
                  ? `Mínimo 1 fotografías.`
                  : 
                    fotos.length === 6 &&
                    `Máximo 6 fotografías`}
                {pesado
                  ? `Imágenes de máximo 200kB.`
                  : '' 
                }
                {formato
                  ? `Sólo se permiten subir imágenes en formato jpg, jpeg, png.`
                  : '' 
                }
              </span>
              
            </p>
            {
              previeImage &&
              <div className='preview' id='preview'>
                <div className='close-btn' onClick={() => setPreviewImage('')}>
                  <p>Cerrar</p>
                </div>
                <div className='image-preview' style={{backgroundImage : `url(${previeImage})`}}>

                </div>
              </div>
            }
            
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
                : ""}
            </span>
            {descripcionLength >= 400 &&
              `${descripcionLength}/500 caracteres máximo.`}
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
