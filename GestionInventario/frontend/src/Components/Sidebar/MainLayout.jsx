import React from 'react';
import Sidebar from './Sidebar';

import { Outlet, Navigate, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../contexts/AuthContext';
import SidebarItem from './SidebarItem'; 
import { ShoppingBasket, Users, Package, LogOut } from 'lucide-react';

const MainLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    // Limpiar el estado de autenticación en el frontend
    logout();
    // Redirigir al usuario a la página de login
    navigate('/login');
   
  };

  return (
    
    <div className="flex h-screen bg-gray-400">
      <Sidebar>
        
        <SidebarItem icon={<ShoppingBasket color="#1447e6"/>} text="Products" to="/products" active /> 
        
        <SidebarItem icon={<Users color="#1447e6"/>} text="Customers" to="/customers/create" /> 
        <SidebarItem icon={<Package color="#1447e6"/>} text="Orders" to="/orders/create" />
        <SidebarItem icon={<LogOut />} text="Logout" onClick={handleLogout} /> 
      </Sidebar>

      <div className="flex flex-col flex-1 ">
        {/* <Header /> */}
        {/* <Navbar /> */}

        <main className="flex-1 p-5 overflow-y-auto bg-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
    
  );
};

export default MainLayout;