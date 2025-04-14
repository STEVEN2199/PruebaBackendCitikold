import './App.css'
import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import LoginForm from './Components/Auth/LoginForm';
import RegistrationForm from './Components/Auth/RegistrationForm';
import ForgotPasswordForm from './Components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './Components/Auth/ResetPasswordForm';

import ProductList from './Components/Product/ProductList';  
import ProductDetail from './Components/Product/ProductDetail';
import EditProductForm from './Components/Product/EditProductForm';    
import CreateOrderForm from './Components/Order/CreateOrderForm';
import CreateCustomerForm from './Components/Customers/CreateCustomerForm';
import Nav from './Components/NavBar/Nav';
import MainLayout from './Components/Sidebar/MainLayout'; // Importa MainLayout
//import Sidebar from './Components/NavBar/Sidebar';
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
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

      {/* Rutas protegidas dentro de MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/products" replace />} /> {/* Redirige / a /products si autenticado */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/edit/:id" element={<EditProductForm />} />
        <Route path="/orders/create" element={<CreateOrderForm />} />
        <Route path="/customers/create" element={<CreateCustomerForm />} />
        {/* Otras rutas protegidas irían aquí */}
      </Route>

      {/* Ruta por defecto para redirigir al login si no autenticado */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function RootApp() {
  return (
  <AuthProvider>
      <App />
  </AuthProvider>
  );
}

export default RootApp;
