import React, { useContext } from "react";
import { SidebarContext } from "./Sidebar";
import { Link } from "react-router-dom"; 

export default function SidebarItem({ icon, text, active, alert, to, onClick }) {
  const { expanded } = useContext(SidebarContext);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-green-200 to-green-100 text-green-500"
            : "hover:bg-green-50 text-gray-100"
        }
    `}
    >
      {to ? (
        <Link to={to} className="flex items-center w-full h-full no-underline text-inherit">
          {icon}
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            } text-blue-700`}
          >
            {text}
          </span>
          {alert && (
            <div
              className={`absolute right-2 w-2 h-2 rounded bg-green-400 ${
                expanded ? "" : "top-2"
              }`}
            />
          )}
        </Link>
      ) : (
        <button onClick={handleClick} className="flex items-center w-full h-full text-inherit">
          {icon}
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            {text}
          </span>
          {alert && (
            <div
              className={`absolute right-2 w-2 h-2 rounded bg-green-400 ${
                expanded ? "" : "top-2"
              }`}
            />
          )}
        </button>
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-green-100 text-green-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}