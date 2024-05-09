<<<<<<< HEAD
import React,{useEffect, useState} from 'react'
import "./habilitarAmigo.css"
import { useEnableFriendModeMutation, useIsEnabledFriendModeQuery } from './clienteSlice';
import useGetToken from '../../hooks/getToken';
import Loading from '../../Components/Loading';

=======
import React, { useEffect, useState } from "react";
import "./habilitarAmigo.css";
import {
  useEnableFriendModeMutation,
  useIsEnabledFriendModeQuery,
} from "./clienteSlice";
import useGetToken from "../../hooks/getToken";
import Loading from "../../Components/Loading";
>>>>>>> e9b927243a3d3dd4cd2658ded3f3a6de99b065d1

const HabilitarAmigo = () => {
  const [precio, setPrecio] = useState(0);
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

<<<<<<< HEAD
const token = useGetToken();

const {data: isEnabled,isFetching,isSuccess} = useIsEnabledFriendModeQuery({token:token})

const [enable,{data: response,isSuccess:isSuccessEnable,isError,error,isLoading}] = useEnableFriendModeMutation();

useEffect(() => {
    console.log(isEnabled);
},[isEnabled])

if (isFetching) {
    return <Loading/>
}else if(isSuccess){
=======
  useEffect(() => {
    if (isError) {
        console.log(error);
    }
    if (isSuccessEnable) {
        console.log(enabled);
    }
  }, [isError, enabled, isSuccessEnable]);
>>>>>>> e9b927243a3d3dd4cd2658ded3f3a6de99b065d1

  if (isFetching || isLoading) {
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
      await enable({ token: token, precio: precio });
    };

<<<<<<< HEAD
    

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
                <button className={`btn btn-azul w-25 ${(!isEnabledBtn || isEnabled.data) && "disabled"}`} onClick={handleSubmit}>Habilitar</button>
=======
    return isEnabled.data ? (
      <p>Ya tienes una cuenta de amigo (cambien de modo aaaaa)</p>
    ) : (
      <div className="habilitar-amigo">
        <div className="habilitar-amigo-container">
          <h1>Habilitar Cuenta Como Amigo</h1>
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
>>>>>>> e9b927243a3d3dd4cd2658ded3f3a6de99b065d1
            </div>
            <button
              className={"btn btn-azul w-25"}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              Habilitar
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default HabilitarAmigo;
