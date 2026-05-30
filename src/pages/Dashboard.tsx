import { useCallback, useEffect, useMemo, useState } from "react";
import GridBoard, { type DashboardKpis } from "../components/dashboard/GridBoard";
import ModelsUsageCard from "../components/dashboard/ModelsUsageCard";
import OperationalAlertsChart from "../components/dashboard/OperationalAlertsChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import WarehouseOccupationChart from "../components/dashboard/WarehouseOccupationChart";
import type { ExpeditionList, Payment } from "../types";
import type { WarehouseMapItem } from "../types/warehouseMap.types";
import {
  getCajas,
  getCajasCount,
  getExpedicionesList,
  getExpedicionesTodayList,
  getPaletsCount,
  getTerminales,
  getTerminalesCount,
  getUbicacionesCount,
  getUbicacionesMapa,
} from "../services/dashboardService";
import "../styles/DashboardPage.scss";

type WidgetState<T> = {
  loading: boolean;
  error: string | null;
  data: T;
};

function widgetInitial<T>(data: T): WidgetState<T> {
  return { loading: true, error: null, data };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Error de carga";
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [kpis, setKpis] = useState<DashboardKpis>({
    terminales: { value: null, loading: true, error: null },
    cajas: { value: null, loading: true, error: null },
    palets: { value: null, loading: true, error: null },
    ubicaciones: { value: null, loading: true, error: null },
    expedicionesHoy: { value: null, loading: true, error: null },
  });

  const [mapaState, setMapaState] = useState<WidgetState<WarehouseMapItem[]>>(widgetInitial([]));
  const [terminalesState, setTerminalesState] = useState<WidgetState<Payment[]>>(widgetInitial([]));
  const [cajasState, setCajasState] = useState<WidgetState<Array<{ id: number; etiqueta: string; modeloProducto?: string | null }>>>(widgetInitial([]));
  const [expedicionesState, setExpedicionesState] = useState<WidgetState<ExpeditionList[]>>(widgetInitial([]));

  const loadDashboard = useCallback(async () => {
    setIsRefreshing(true);

    setKpis((prev) => ({
      terminales: { ...prev.terminales, loading: true, error: null },
      cajas: { ...prev.cajas, loading: true, error: null },
      palets: { ...prev.palets, loading: true, error: null },
      ubicaciones: { ...prev.ubicaciones, loading: true, error: null },
      expedicionesHoy: { ...prev.expedicionesHoy, loading: true, error: null },
    }));

    setMapaState((prev) => ({ ...prev, loading: true, error: null }));
    setTerminalesState((prev) => ({ ...prev, loading: true, error: null }));
    setCajasState((prev) => ({ ...prev, loading: true, error: null }));
    setExpedicionesState((prev) => ({ ...prev, loading: true, error: null }));

    const [
      terminalesCountResult,
      cajasCountResult,
      paletsCountResult,
      ubicacionesCountResult,
      expedicionesHoyResult,
      mapaResult,
      terminalesResult,
      cajasResult,
      expedicionesResult,
    ] = await Promise.allSettled([
      getTerminalesCount(),
      getCajasCount(),
      getPaletsCount(),
      getUbicacionesCount(),
      getExpedicionesTodayList(),
      getUbicacionesMapa(),
      getTerminales(),
      getCajas(),
      getExpedicionesList(),
    ]);

    setKpis({
      terminales:
        terminalesCountResult.status === "fulfilled"
          ? { value: terminalesCountResult.value, loading: false, error: null }
          : { value: null, loading: false, error: getErrorMessage(terminalesCountResult.reason) },
      cajas:
        cajasCountResult.status === "fulfilled"
          ? { value: cajasCountResult.value, loading: false, error: null }
          : { value: null, loading: false, error: getErrorMessage(cajasCountResult.reason) },
      palets:
        paletsCountResult.status === "fulfilled"
          ? { value: paletsCountResult.value, loading: false, error: null }
          : { value: null, loading: false, error: getErrorMessage(paletsCountResult.reason) },
      ubicaciones:
        ubicacionesCountResult.status === "fulfilled"
          ? { value: ubicacionesCountResult.value, loading: false, error: null }
          : { value: null, loading: false, error: getErrorMessage(ubicacionesCountResult.reason) },
      expedicionesHoy:
        expedicionesHoyResult.status === "fulfilled"
          ? { value: expedicionesHoyResult.value.length, loading: false, error: null }
          : { value: null, loading: false, error: getErrorMessage(expedicionesHoyResult.reason) },
    });

    setMapaState(
      mapaResult.status === "fulfilled"
        ? { data: mapaResult.value, loading: false, error: null }
        : { data: [], loading: false, error: getErrorMessage(mapaResult.reason) }
    );

    setTerminalesState(
      terminalesResult.status === "fulfilled"
        ? { data: terminalesResult.value, loading: false, error: null }
        : { data: [], loading: false, error: getErrorMessage(terminalesResult.reason) }
    );

    setCajasState(
      cajasResult.status === "fulfilled"
        ? { data: cajasResult.value, loading: false, error: null }
        : { data: [], loading: false, error: getErrorMessage(cajasResult.reason) }
    );

    setExpedicionesState(
      expedicionesResult.status === "fulfilled"
        ? { data: expedicionesResult.value.slice(0, 8), loading: false, error: null }
        : { data: [], loading: false, error: getErrorMessage(expedicionesResult.reason) }
    );

    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadDashboard]);

  const ocupacion = useMemo(() => {
    const total = mapaState.data.length;
    const ocupados = mapaState.data.filter((item) => item.pale !== null).length;
    const libres = Math.max(0, total - ocupados);
    const capacidadTotal = mapaState.data.reduce((acc, item) => acc + item.estanteria.capacidadMaxCajas, 0);
    const usadasTotal = mapaState.data.reduce((acc, item) => acc + item.ocupacionActual, 0);
    const media = capacidadTotal > 0 ? (usadasTotal / capacidadTotal) * 100 : 0;
    return { total, ocupados, libres, media: Number(media.toFixed(1)) };
  }, [mapaState.data]);

  const distribucionPasillo = useMemo(() => {
    const byPasillo = new Map<number, { total: number; ocupados: number; libres: number }>();

    mapaState.data.forEach((item) => {
      const key = item.pasillo.numero;
      const current = byPasillo.get(key) ?? { total: 0, ocupados: 0, libres: 0 };
      current.total += 1;
      if (item.pale) {
        current.ocupados += 1;
      } else {
        current.libres += 1;
      }
      byPasillo.set(key, current);
    });

    return Array.from(byPasillo.entries())
      .map(([pasillo, value]) => ({ pasillo, ...value }))
      .sort((a, b) => a.pasillo - b.pasillo);
  }, [mapaState.data]);

  const topModelos = useMemo(() => {
    const counter = new Map<string, number>();

    cajasState.data.forEach((caja) => {
      const modelo = (caja.modeloProducto || "Sin modelo").trim();
      counter.set(modelo, (counter.get(modelo) ?? 0) + 1);
    });

    return Array.from(counter.entries())
      .map(([modelo, total]) => ({ modelo, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [cajasState.data]);

  const alertasEstado = useMemo(() => {
    const counter = new Map<string, number>();

    terminalesState.data.forEach((t) => {
      const key = t.estado;
      counter.set(key, (counter.get(key) ?? 0) + 1);
    });

    return Array.from(counter.entries())
      .map(([estado, total]) => ({ estado, total }))
      .sort((a, b) => b.total - a.total);
  }, [terminalesState.data]);

  return (
    <div className="dashboard-page container-fluid p-4 d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h1 className="h4 mb-0">Dashboard de estadísticas</h1>
        <button type="button" className="btn btn-outline-primary" onClick={() => void loadDashboard()} disabled={isRefreshing}>
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      <GridBoard kpis={kpis} />

      <div className="row g-4">
        <div className="col-12">
          <WarehouseOccupationChart
            loading={mapaState.loading}
            error={mapaState.error}
            ocupacion={ocupacion}
            distribucionPasillo={distribucionPasillo}
          />
        </div>

        <div className="col-12 col-xl-6">
          <ModelsUsageCard loading={cajasState.loading} error={cajasState.error} items={topModelos} />
        </div>

        <div className="col-12 col-xl-6">
          <OperationalAlertsChart loading={terminalesState.loading} error={terminalesState.error} items={alertasEstado} />
        </div>
      </div>

      <RecentActivity expediciones={expedicionesState.data} loading={expedicionesState.loading} error={expedicionesState.error} />
    </div>
  );
}
