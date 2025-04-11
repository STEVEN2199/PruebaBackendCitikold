import './App.css'
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/Auth/LoginForm';
import RegistrationForm from './Components/Auth/RegistrationForm';
import ForgotPasswordForm from './Components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './Components/Auth/ResetPasswordForm';

import ProductList from './Components/Product/ProductList';  
import ProductDetail from './Components/Product/ProductDetail';
import EditProductForm from './Components/Product/EditProductForm';    
import { AuthProvider, useAuth } from './contexts/AuthContext';


// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated en PrivateRoute:", isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {

  return (
      <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} /> {/* Nueva ruta */}
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
          <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} /> {/**/} 
          {/* Ruta para la lista de productos */}
          <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>}/>{/**/} 
          <Route path="/products/edit/:id" element={<PrivateRoute><EditProductForm /></PrivateRoute>} /> {/* Nueva ruta para editar */}
          {/* Ruta para los detalles del producto */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Redirigir a /products por defecto si está autenticado */}
      </Routes>
  )
}

export default App
