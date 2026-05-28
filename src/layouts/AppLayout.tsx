import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import "../styles/AppLayout.scss";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => setSidebarCollapsed(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="app-layout min-vh-100 d-flex flex-column bg-light">
      {/* Header superior */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Zona principal: sidebar + contenido */}
      <div className="flex-grow-1 d-flex app-layout__body">
        {/* Sidebar fija */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* Contenido principal */}
        <div className="flex-grow-1 d-flex flex-column app-layout__content" style={{ minWidth: 0 }}>
          <main className="flex-grow-1">
            <Outlet />
          </main>

          <footer className="d-flex justify-content-center py-3">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
}
