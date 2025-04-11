import React, { useState } from 'react';
import axios from 'axios';

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
        <div>
            <h2>¿Olvidaste tu contraseña?</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Enviar enlace de restablecimiento</button>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;