import { Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import SNSearchPage from "../pages/SNSearchPage";
import StockUbicationPage from "../pages/StockUbicationPage";
import TerminalFormPage from "../pages/TerminalFormPage";
import RequireAuth from "./RequireAuth";
import ExpeditionDetailPage from "../pages/ExpeditionDetailPage";
import ExpeditionsListPage from "../pages/ExpeditionsListPage";
import BoxTerminalsPage from "../pages/BoxTerminalsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SNSearchPage />} />
          <Route path="/stock" element={<StockUbicationPage />} />
          <Route path="/stock/ubicacion/:ubicacionId" element={<StockUbicationPage />} />
          <Route path="/stock/boxes/:boxId/terminals" element={<BoxTerminalsPage />} />
          <Route path="/terminal-form" element={<TerminalFormPage />} />
          <Route path="/expeditions" element={<ExpeditionsListPage />} />
          <Route path="/expeditions/new" element={<ExpeditionDetailPage />} />
          <Route path="/expeditions/:reference/edit" element={<ExpeditionDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
