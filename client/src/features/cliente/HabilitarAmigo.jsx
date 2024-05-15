import React,{useEffect, useState} from 'react'
import "./habilitarAmigo.css"
import { useEnableFriendModeMutation,  useDisableFriendModeMutation, useChangePriceMutation } from './clienteSlice';
import useGetToken from '../../hooks/getToken';
import Loading from '../../Components/Loading';
import { useGlobalContext } from '../../context';
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

const HabilitarAmigo = ({ modalcito }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isEnabledBtn, setIsEnabledBtn] = useState(true);
  const token = useGetToken();
  const { isFriendModeEnabled } = useGlobalContext();
  const [precio, setPrecio] = useState(isFriendModeEnabled);

  // const {
  //   data: isEnabled,
  //   isFetching,
  //   isSuccess,
  // } = useIsEnabledFriendModeQuery({ token: token });

  const [
    enable,
    { data: enabled, isSuccess: isSuccessEnable, isError, error, isLoading },
  ] = useEnableFriendModeMutation();

  const [disable, { data: disabled, isSuccess: isSuccessDisable }] = useDisableFriendModeMutation();

  const [change,{data,isLoading:isLoadingChange,isSuccess:isSuccessChange,isError:isErrorChange,error:errorChange}] = useChangePriceMutation();

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    if (isSuccessEnable) {
      console.log(enabled);
    }
  }, [isError, enabled, isSuccessEnable, error]);

  useEffect(() => {
    if (isSuccessDisable) {
      console.log(disabled);
    }
  }, [isSuccessDisable, disabled]);

  useEffect(() => {
    console.log(isFriendModeEnabled, "precio");
  }, [isFriendModeEnabled]);

  if (isSuccessEnable) {
    return (
      <p>
        Registrado correctamente como amigo (lo cambiamos de modo ? (´▽`ʃ♡ƪ))
      </p>
    );
  } else {
    const handleChange = (e) => {
      let value = e.target.value;
      if (value < 0 || value > 150) return;
      setPrecio(value);
    };

    const handleSubmit = async () => {
      setIsEnabledBtn(false);
      if (!isFriendModeEnabled) {
        await enable({ token: token, precio: precio });
      } else {
        await disable({ token: token });
      }
    };

    const handleChangePrice = async () => {
        setIsEnabledBtn(false);
        await change({ token: token, precio:precio });
    }

    

    return(
      <div className="habilitar-amigo">
        <div className="habilitar-amigo-container">
          <h1>
            {isFriendModeEnabled
              ? "Cuenta Como Amigo Habilitada"
              : "Habilitar Cuenta Como Amigo"}
          </h1>
          <div className="habilitar-form">
            <div className="input-item">
              <label htmlFor="precio">Precio por hora (en Bs).</label>
              <input
                className="form-control mt-2"
                type="number"
                id="precio"
                name="precio"
                placeholder="Precio"
                value={precio}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="btns">
            
              {isFriendModeEnabled ? (
                <>
                  <button className='btn btn-azul' disabled={isLoadingChange} onClick={handleChangePrice}>Cambiar Precio</button>
                  <button
                    className={`btn btn-outline-secondary`}
                    disabled={isLoading}
                    onClick={handleSubmit}
                  >
                    Deshabilitar Cuenta
                  </button>
                </>
              ) : (
                <div>
                  <div className="terminossss d-inline"
                  style={{marginTop:"40px"}}>
                    {acceptedTerms ? (
                      <ImCheckboxChecked
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setAcceptedTerms(false);
                        }}
                      />
                    ) : (
                      <ImCheckboxUnchecked
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setAcceptedTerms(true);
                        }}
                      />
                    )}
                    <p className="d-inline">Estoy de acuerdo con los </p>
                    <p
                      style={{ cursor: "pointer" }}
                      className="link-primary d-inline"
                      onClick={() => {
                        modalcito(true);
                        console.log("abrir un modal");
                      }}
                    >
                      terminos y condiciones
                    </p>
                  </div>
                  <p></p>
                  <button
                    className={`btn btn-azul ${!isEnabledBtn && "disabled"}`}
                    disabled={isLoading || !acceptedTerms}
                    onClick={handleSubmit}
                  >
                    Habilitar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default HabilitarAmigo;
