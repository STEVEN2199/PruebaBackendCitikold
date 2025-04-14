import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/fondo.jpg";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('https://localhost:7193/api/Auth/forgot-password', { email });
            setMessage(response.data.message || 'Se ha enviado un correo electrónico para restablecer tu contraseña.');
        } catch (error) {
            setError(error.response?.data?.message || 'Error al solicitar el restablecimiento de contraseña. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
            >
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">¿Olvidaste tu contraseña?</h2>
                {message && <p className="text-green-500 mb-4 text-sm">{message}</p>}
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Correo Electrónico:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Enviar enlace de restablecimiento
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

export default ForgotPasswordForm;