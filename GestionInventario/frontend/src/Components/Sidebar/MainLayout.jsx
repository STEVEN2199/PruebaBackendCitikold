import React from 'react';
import Sidebar from './Sidebar'; // Asegúrate de la ruta correcta
// import Header from './Header'; // Si tienes un Header
// import Navbar from './Navbar'; // Si tienes un Navbar
import { Outlet, Navigate, useNavigate } from 'react-router-dom'; // Importa Link
import { useAuth } from '../../contexts/AuthContext';
import SidebarItem from './SidebarItem'; // Importa SidebarItem
import { Home, ShoppingBasket, Users, Package, LogOut, PackagePlus } from 'lucide-react';

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
    // No es necesario hacer una petición al backend en este caso
    // ya que no tenemos un endpoint de logout definido.
  };

  return (
    
    <div className="flex h-screen bg-gray-400">
      <Sidebar>
        {/* Renderiza tus SidebarItem aquí, dentro del componente Sidebar */}
        <SidebarItem icon={<ShoppingBasket color="#1447e6"/>} text="Products" to="/products" active /> {/* Ejemplo con Link */}
        {/*<SidebarItem icon={<PackagePlus color="#1447e6"/>} text="ProductsAdd" to="/products/CreateProduct" />*/}
        <SidebarItem icon={<Users color="#1447e6"/>} text="Customers" to="/customers/create" /> {/* Ajusta las rutas */}
        <SidebarItem icon={<Package color="#1447e6"/>} text="Orders" to="/orders/create" />
        <SidebarItem icon={<LogOut />} text="Logout" onClick={handleLogout} /> {/* Ejemplo con onClick */}
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