import React, { useState, useContext } from "react"; // Import useContext
//import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Import the Context itself
import apiClient from "../../api/apiClient";

const LoginForm = () => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use useContext to get the login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/Auth/login", {
        userName,
        password,
      });
      //const { token } = response.data.message;
      console.log(response.data.message);
      login(response.data.message); // Call the login function from the context
      navigate("/products");
      console.log("Inicio de sesión exitoso:", response.data);
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response?.data?.message ||
          "Error al iniciar sesión. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">Nombre Usuario:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
      <p>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </p>
    </div>
  );
};

export default LoginForm;
