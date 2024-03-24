import React,{useState} from 'react'
import { Link } from 'react-router-dom';

const LogIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);


    const handleBtn = () => {
        console.log("pip");
    }

  return (
    <div className="form-section mw-100 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="form-section-center p-5">
        <h1 className="mb-4 text-start fw-bold">Iniciar Sesión</h1>
        <form>
          <div className="form-item mb-3">
            <label htmlFor="username " className="form-label fw-semibold">
              Nombre de usuario
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
          </div>
          <div className="form-item mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {showFeedback && (
            <p className="text-danger mb-4" style={{ fontSize: "0.9rem" }}>
              El nombre de usuario o la contraseña son incorrectas
            </p>
          )}
          <p className='form-text'>
            <Link to={"/register"}>Olvide mi contraseña</Link>
          </p>
          <button className="btn btn-azul mb-2" onClick={handleBtn}>
            Iniciar Sesión
          </button>
          <p className="form-text">
            No tienes una cuenta<Link to={"/register"}> haz click aquí.</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LogIn
