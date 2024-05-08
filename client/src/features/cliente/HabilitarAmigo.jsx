import React,{useState} from 'react'
import "./habilitarAmigo.css"

const HabilitarAmigo = () => {

const [precio,setPrecio] = useState(0);

const handleChange = (e) => {
    let value = e.target.value;
    if(value < 0 || value > 150) return;
    setPrecio(value);
}

  return (
    <div className='habilitar-amigo'>
      <div className="habilitar-amigo-container">
        <h1>Habilitar Cuenta Como Amigo</h1>
        <div className="habilitar-form">
            <div className="input-item">
                <label htmlFor="precio">Precio por hora (en Bs).</label>
                <input  className="form-control mt-2" 
                type="number" 
                id="precio" 
                name="precio" 
                placeholder='Precio'
                value={precio}
                onChange={(e) => handleChange(e)} />
            </div>
            <button className='btn btn-azul w-25'>Habilitar</button>
        </div>
      </div>
    </div>
  )
}

export default HabilitarAmigo
