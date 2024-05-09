import React, { useEffect, useState } from "react";
import "./habilitarAmigo.css";
import {
  useEnableFriendModeMutation,
  useIsEnabledFriendModeQuery,
} from "./clienteSlice";
import useGetToken from "../../hooks/getToken";
import Loading from "../../Components/Loading";

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

  useEffect(() => {
    if (isError) {
        console.log(error);
    }
    if (isSuccessEnable) {
        console.log(enabled);
    }
  }, [isError, enabled, isSuccessEnable]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    const handleChange = (e) => {
      let value = e.target.value;
      if (value < 0 || value > 150) return;
      setPrecio(value);
    };

    const handleSubmit = async () => {
      await enable({ token: token, precio: precio });
    };

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
