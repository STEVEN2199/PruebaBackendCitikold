import React, { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
    const [loading, setLoading] = useState(true);

    // Función para iniciar sesión
    const login = (token, refresh) => {
        console.log("Token recibido en login:", token, refresh);
        setAuthToken(token);
        setRefreshToken(refresh);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refresh);
    };

    // Función para cerrar sesión
    const logout = () => {
        setAuthToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    };

    // Función para refrescar el token
    const refreshTokenFn = async () => {
        if (!refreshToken) {
            setIsAuthenticated(false);
            setAuthToken(null);
            setLoading(false);
            return false;
        }

        try {
            const response = await fetch('/api/Auth/refresh-token', { // Ajusta la ruta si es diferente
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                const newAccessToken = data.accessToken; // Asegúrate del nombre de la propiedad
                const newRefreshToken = data.refreshToken; // Asegúrate del nombre de la propiedad (puede ser el mismo)

                setAuthToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                setIsAuthenticated(true);
                localStorage.setItem('authToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                setLoading(false);
                return true;
            } else {
                // El refresh token no es válido o ha expirado
                logout(); // Limpiar la sesión
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Error al refrescar el token:", error);
            logout(); // Limpiar la sesión en caso de error de conexión
            setLoading(false);
            return false;
        }
    };

    // Verificar el token al cargar la aplicación (opcional)
    useEffect(() => {
        const checkToken = async () => {
            setLoading(true);
            if (authToken) {
                // Aquí podrías hacer una petición al backend para validar el token
                // Por ahora, asumimos que si hay un token en localStorage, es válido
                setIsAuthenticated(true);
                setLoading(false);
            } else if (refreshToken) {
                // Intentar refrescar el token si no hay un accessToken pero sí un refreshToken
                await refreshTokenFn();
            } else {
                setIsAuthenticated(false);
                setLoading(false);
            }
        };

        checkToken();
    }, [refreshToken,authToken]);

    const value = {
        isAuthenticated,
        authToken,
        login,
        logout,
        loading,
    };

    /*return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );*/

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthContext }; // Exporta AuthContext como una named export