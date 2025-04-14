import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { createContext, useState, useEffect  } from "react";
import logoImage from '../../assets/citikold.png';
import userIcon from '../../assets/userIcon.png';

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userName, setUserName] = useState('');
  const [userFullName, setUserFullName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decodificar el token JWT (asumiendo que es un JWT estándar)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const firstName = payload['FirstName'] || '';
        const lastName = payload['LastName'] || '';
        const nameClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';

        setUserName(`${firstName} ${lastName}`.trim() || nameClaim);
        setUserFullName(`${firstName} ${lastName}`.trim() || nameClaim); // Usamos el mismo para el span por ahora
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUserName('Usuario Desconocido');
        setUserFullName('Usuario Desconocido');
      }
    } else {
      setUserName('No Autenticado');
      setUserFullName('No Autenticado');
    }
  }, []);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logoImage}
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src={userIcon}
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{userName}</h4>
              <span className="text-xs text-gray-600">{userFullName}</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export { SidebarContext };