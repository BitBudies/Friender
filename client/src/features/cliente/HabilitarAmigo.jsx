import React,{useEffect, useState} from 'react'
import "./habilitarAmigo.css"
import { useEnableFriendModeMutation, useIsEnabledFriendModeQuery } from './clienteSlice';
import useGetToken from '../../hooks/getToken';
import Loading from '../../Components/Loading';


const HabilitarAmigo = () => {
  const [precio, setPrecio] = useState(0);
  const [isEnabledBtn,setIsEnabledBtn] = useState(true);
  const token = useGetToken();

  const {
    data: isEnabled,
    isFetching,
    isSuccess,
  } = useIsEnabledFriendModeQuery({ token: token });

  const [
    enable,
    { data: enabled, isSuccess: isSuccessEnable, isError, error, isLoading },
  ] = useEnableFriendModeMutation();

  useEffect(() => {
    if (isError) {
        console.log(error);
    }
    if (isSuccessEnable) {
        console.log(enabled);
    }
  }, [isError, enabled, isSuccessEnable, error]);

  if (isFetching ) {
    return <Loading />
  } else if (isSuccessEnable) {
    return <p>Registrado correctamente como amigo (lo cambiamos de modo ? (´▽`ʃ♡ƪ))</p>
  } else if (isSuccess) {
    const handleChange = (e) => {
      let value = e.target.value;
      if (value < 0 || value > 150) return;
      setPrecio(value);
    };

    const handleSubmit = async () => {
        isEnabledBtn(false);
      await enable({ token: token, precio: precio });
    };

    return(
      <div className="habilitar-amigo">
        <div className="habilitar-amigo-container">
          <h1>{isEnabled ? "Cuenta Como Amigo Habilitada" : "Habilitar Cuenta Como Amigo"}</h1>
          <div className="habilitar-form">
            <div className="input-item">
              <label htmlFor="precio">Precio por hora (en Bs).</label>
              <input
                className="form-control mt-2"
                type='number'
                id="precio"
                name="precio"
                placeholder="Precio"
                value={precio}
                onChange={(e) => handleChange(e)}
              />
            </div>
            {
                isEnabled ? (
                    <div className="btns">
                        <button className='btn btn-azul'>Cambiar Precio</button>
                    <button
                        className={`btn btn-outline-secondary`}
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        Deshabilitar Cuenta
                    </button>
                    
                </div>
                ) :
                 (
             <button
              className={`btn btn-azul ${!isEnabledBtn && "disabled"}`}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              Habilitar
            </button>
                 )
                
            }
            
          </div>
        </div>
      </div>
    );
  }
};

export default HabilitarAmigo;
