import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/session";

type SidebarProps = {
  collapsed: boolean;
};

export default function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      navigate("/login", { replace: true, state: { skipSessionCheck: true } });
    }
  };

  return (
    <aside className={`app-sidebar border-end bg-light p-3 flex-shrink-0 ${collapsed ? "app-sidebar--collapsed" : ""}`.trim()}>
      <div className="d-flex flex-column gap-3 h-100">
        <nav className="nav nav-pills flex-column gap-1 app-sidebar__nav">
          <NavItem to="/dashboard" icon="dashboard" label="Inicio" collapsed={collapsed} />
          <NavItem to="/search" icon="search" label="Búsqueda por SN" collapsed={collapsed} />
          <NavItem to="/stock" icon="map" label="Mapa Almacén" collapsed={collapsed} />
          <NavItem to="/expeditions" icon="list_alt" label="Expediciones" collapsed={collapsed} />
        </nav>

        <div className="mt-auto">
          <button
            type="button"
            className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 app-sidebar__logout-btn w-100"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="app-sidebar__logout-text">{isLoggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

type NavItemProps = {
  to: string;
  icon: string;
  label: string;
  collapsed: boolean;
};

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        ["nav-link d-flex align-items-center gap-2 app-sidebar__link", isActive ? "active fw-semibold" : "text-dark", collapsed ? "justify-content-center" : ""].join(" ")
      }
      title={collapsed ? label : undefined}
    >
      <span className="material-symbols-outlined app-sidebar__link-icon">{icon}</span>
      {!collapsed && label}
    </NavLink>
  );
}
