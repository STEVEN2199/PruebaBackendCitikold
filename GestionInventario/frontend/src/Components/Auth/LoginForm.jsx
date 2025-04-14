import React, { useState, useContext } from "react"; // Import useContext
//import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Import the Context itself
import apiClient from "../../api/apiClient";
import backgroundImage from "../../assets/fondo.jpg";

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
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
    >
            {/* Contenedor principal centrado */}
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                {/* Contenedor con fondo blanco, padding, bordes redondeados y sombra */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
                {/* Título grande, en negrita, gris oscuro, margen inferior y centrado */}
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                {/* Mensaje de error en rojo, margen inferior y texto pequeño */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Formulario con espacio vertical entre elementos */}
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">
                            {/* Label como bloque, texto gris oscuro, pequeño y en negrita con margen inferior */}
                            Nombre Usuario:
                        </label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                       
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <div className="mt-4 text-center">
                    {/* Contenedor para los enlaces con margen superior y texto centrado */}
                    <p className="text-gray-600 text-sm">
                        ¿No tienes una cuenta? <Link to="/register" className="text-blue-500 hover:underline">Regístrate aquí</Link>
                        {/* Enlace con texto azul y subrayado al pasar el ratón */}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        <Link to="/forgot-password" className="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</Link>
                    </p>
                </div>
            </div>
        </div>
  );
};

export default LoginForm;
