import { useEffect, useState } from "react";
import { getAuthenticatedUser, getAuthUserFromCookie, type AuthUser } from "../auth/session";

type HeaderProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

function formatRoles(roles: string): string {
  const cleaned = roles.replace(/[\[\]]/g, "").replace(/ROLE_/g, "").trim();
  return cleaned || "Sin rol";
}

export default function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getAuthUserFromCookie());

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme-mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute("data-theme", shouldUseDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (authUser) return;

    let isMounted = true;
    const loadUser = async () => {
      const user = await getAuthenticatedUser();
      if (isMounted && user) {
        setAuthUser(user);
      }
    };
    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const handleThemeToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    window.localStorage.setItem("theme-mode", next ? "dark" : "light");
  };

  return (
    <header className="app-header border-bottom bg-light d-flex align-items-center justify-content-between px-3 px-md-4">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-outline-secondary app-header__menu-btn d-inline-flex align-items-center justify-content-center"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
        >
          <i className={`bi ${sidebarCollapsed ? "bi-list" : "bi-layout-sidebar-inset-reverse"}`} />
        </button>
         <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-primary">flare</span>
            <h1 className="h6 m-0 fw-bold app-header__title">PI-PLUS</h1>
          </div>
      </div>

      <div className="d-flex align-items-center gap-3"> 
        <div className="d-flex align-items-center gap-2 app-header__user">
          <div className="app-header__user-text text-end">
            <div className="fw-semibold">{authUser?.username || "Usuario"}</div>
            <div className="text-muted small">{authUser ? formatRoles(authUser.roles) : "Sin rol"}</div>
        </div>
          <div className="app-header__avatar" aria-hidden="true" />
        </div>
        <div className="form-check form-switch m-0 app-header__theme-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="themeSwitch"
            checked={isDarkMode}
            onChange={handleThemeToggle}
          />
        </div>
      </div>
    </header>
  );
}
