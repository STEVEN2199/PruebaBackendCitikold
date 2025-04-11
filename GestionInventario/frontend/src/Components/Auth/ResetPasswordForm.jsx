import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const ResetPasswordForm = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token: tokenFromParams } = useParams(); // Intenta obtener el token de los parámetros de la ruta (/reset-password/:token)
    const [searchParams] = useSearchParams(); // Para leer los query parameters (?token=...)

    useEffect(() => {
        const tokenFromQuery = searchParams.get('token');
        let finalToken = '';
    
        if (tokenFromQuery) {
            finalToken = tokenFromQuery.replace(/ /g, '+'); // Reemplaza todos los espacios con '+'
            try {
                finalToken = decodeURIComponent(finalToken);
                console.log("Token extraído, reemplazando espacios y decodificando:", finalToken);
            } catch (error) {
                console.error("Error al decodificar el token de la URL:", error);
                console.log("Usando token después de reemplazar espacios:", finalToken);
            }
            setToken(finalToken);
        } else if (tokenFromParams) {
            setToken(tokenFromParams);
            console.log("Token extraído de los parámetros de la ruta:", tokenFromParams);
        }
    }, [searchParams, tokenFromParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        const emailFromUrl = searchParams.get('email');

        try {
            const response = await axios.post('https://localhost:7193/api/Auth/reset-password', {
                token,
                email: emailFromUrl,
                newPassword,
                confirmNewPassword,
            });
            setMessage(response.data.message || 'Contraseña restablecida exitosamente.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al restablecer la contraseña. Por favor, verifica el enlace e inténtalo de nuevo.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Restablecer Contraseña</h2>
                {message && <p className="text-green-500 mb-4 text-sm">{message}</p>}
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="hidden"
                        id="token"
                        value={token}
                    />
                    <input
                        type="hidden"
                        id="email"
                        value={searchParams.get('email') || ''}
                    />
                    <div>
                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Nueva Contraseña:
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirmar Nueva Contraseña:
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Restablecer Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordForm;