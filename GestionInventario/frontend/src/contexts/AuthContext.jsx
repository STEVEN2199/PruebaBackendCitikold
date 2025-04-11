import React, { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
    const [loading, setLoading] = useState(true);

    // Función para iniciar sesión
    const login = (token) => {
        console.log("Token recibido en login:", token);
        setAuthToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', token);
    };

    // Función para cerrar sesión
    const logout = () => {
        setAuthToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
    };

    // Verificar el token al cargar la aplicación (opcional)
    useEffect(() => {
        const checkToken = async () => {
            if (authToken) {
                // Aquí podrías hacer una petición al backend para validar el token
                // Por ahora, asumimos que si hay un token en localStorage, es válido
                setIsAuthenticated(true);
            }
            setLoading(false);
        };

        checkToken();
    }, [authToken]);

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
          {children}
        </AuthContext.Provider>
      );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthContext }; // Exporta AuthContext como una named export