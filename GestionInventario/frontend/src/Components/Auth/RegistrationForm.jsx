import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import backgroundImage from "../../assets/fondo.jpg";

const RegistrationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await apiClient.post("/Auth/register", {
        firstName,
        lastName,
        username,
        email,
        password,
      });
      console.log("Registro exitoso:", response.data);
      navigate("/login"); // Redirigir a la página de inicio de sesión después del registro
    } catch (error) {
      console.log(
        `Error al registrar usuario: ${
          error.response ? error.response.data : error.message
        }`
      );
      setError(
        error.response?.data?.message ||
          "Error al registrar usuario. Por favor, inténtalo de nuevo."
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registro de Usuario</h2>
                {/* Título grande, en negrita, gris oscuro, margen inferior y centrado */}
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                {/* Mensaje de error en rojo, margen inferior y texto pequeño */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Formulario con espacio vertical entre elementos */}
                    <div>
                        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Apellido:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Nombre Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        
                    >
                        Registrarse
                    </button>
                </form>
                <div className="mt-4 text-center">
                    {/* Contenedor para el enlace con margen superior y texto centrado */}
                    <p className="text-gray-600 text-sm">
                        ¿Ya tienes una cuenta? <Link to="/login" className="text-green-500 hover:underline">Inicia sesión aquí</Link>
                        {/* Enlace con texto verde y subrayado al pasar el ratón */}
                    </p>
                </div>
            </div>
        </div>
  );
};

export default RegistrationForm;
