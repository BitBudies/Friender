import React,{useEffect, useState} from 'react'
import "./Registrarse_2.css";
import { useGetInteresesQuery, useUploadImageMutation, useGetCsrfQuery } from './authSlice';


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
    const [pLabels, setPLabels] = useState(false)
    const [pFotos, setPFotos] = useState(false)

    // para imagenes
    const [send, {data: respuesta, isFetching: carganding, isSuccess: correctito, isError: errosito, error: responseerror}] = useUploadImageMutation();

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
                    <div class='x-interes'>
                        <strong> ${value} </strong>
                    </div>
                `;
                container.appendChild(element);

            }
            const selectElement = document.getElementById('selInteres');
            selectElement.style.color='#000'  
        }
        if (name === 'input-foto'){
            const element = document.getElementById('input-foto');
            if (values.fotos.length === 7) {
                alert('Se permite un máximo de 7 imágenes');
                element.value = '';
                return;
            }
            
            const selectedFile = e.target.files[0];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (['jpg', 'png', 'jpeg'].indexOf(fileExtension) === -1) {
                alert('Solo se permiten archivos JPG, JPEG y PNG.');
                element.value = ''; 
                return;
            }
            if (selectedFile.size > 200000){
                alert('Su imagen es muy pesada, máximo 200kB');
                element.value = '';
                return;
            }

            setPFotos(true)
            setValues({...values,fotos : [...values.fotos,selectedFile]})

            const container = document.getElementById('para-fotos'); 
            const reader =  new FileReader();
        
            const imageElement = document.createElement('img')
            reader.onload = function (e) {
                imageElement.src = e.target.result;
                imageElement.alt = 'Imagen'; 
                imageElement.width = '100';
                imageElement.height = '100'; 
            }
            reader.readAsDataURL(selectedFile)
            container.appendChild(imageElement);
            
        }
    };

    const rojoClase = descripcionLength < 30 ? 'texto-rojo' : '';

    useEffect(() => {
        console.log(values);
    },[values])

    useEffect(() => {
        setPLabels(true)
    }, [pLabels])

    useEffect(() => {
        setPFotos(true)
    }, [pFotos])
    
   
    //DOM events
    if (pLabels){
        document.getElementById('para-labels').addEventListener('click', function(e) {
            // Aqui tiene que quitar elementos del useState 
            const contenido = e.target.textContent
            const index = values.interes.indexOf(contenido)

            e.target.remove()
            // SetState(list => list.filter((_,index) => Index! == index)
        });
    }
    if (pFotos){
        document.getElementById('para-fotos').addEventListener('click', function (e) {
            // Aqui tiene que quitar elementos del useState

            e.target.remove()
            const element = document.getElementById('input-foto');
            element.value = '';
        });
    }

    // @kevin huayllas pinto hay que usar el csrf en todos los post
    const {data: csrf, error, isLoading } = useGetCsrfQuery({})
    useEffect(() => {
      if (csrf) {
        document.cookie = `csrftoken=${csrf.csrf_token}; path=/;`;
      }
    }, [csrf]);

    const mandarrr = async () => {
      const form = new FormData();
      form.append("nombre", "jhon");
      form.append("ap_paterno", "gutierrez");
      form.append("ap_materno", "hinojosa");
      form.append("ci", "12345678");
      form.append("fecha_nacimiento", "1200-01-01");
      form.append("genero", "O");
      form.append("direccion", "avenida las nieves");
      form.append("descripcion", "descripcion de jhon");
      form.append("usuario", "yon1234");
      form.append("correo", "jhondeycraft776@gmail.com");
      form.append("contrasena", "yon1234");
      values.fotos.forEach((it) => {
        form.append("imagenes", it)
      })
      values.interes.forEach((it) => {
        form.append("intereses", it)
      })
      send(form);
    }
  
    useEffect(() => { 
      console.log(responseerror);
    }, [responseerror])
  return (
    <div className="form-item">
      <div className="form-2">
        <div className="toColumns">
          <section className="interes">
            <p>Intereses*</p>   
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
            <p>Fotos*</p>
            <input
              className="form-control"
              type="file"
              name="input-foto"
              id="input-foto"
              onChange={handleChange}
              accept=".jpg, .png, .jpeg"
            />
            <div className='para-fotos' id='para-fotos'>
                        {/* se llena dinamicamente */}
            </div>
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
          <button className="btn btn-azul siguiente" type="button" onClick={mandarrr}>
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
