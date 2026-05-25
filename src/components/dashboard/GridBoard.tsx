import { GridCard } from "./GridCard";

export type DashboardKpis = {
  terminales: { value: number | null; loading: boolean; error: string | null };
  cajas: { value: number | null; loading: boolean; error: string | null };
  palets: { value: number | null; loading: boolean; error: string | null };
  ubicaciones: { value: number | null; loading: boolean; error: string | null };
  expedicionesHoy: { value: number | null; loading: boolean; error: string | null };
};

export default function GridBoard({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="row g-4">
      <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
        <GridCard
          title="Total terminales"
          value={String(kpis.terminales.value ?? "-")}
          icon="inventory_2"
          loading={kpis.terminales.loading}
          error={kpis.terminales.error}
        />
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
        <GridCard
          title="Total cajas"
          value={String(kpis.cajas.value ?? "-")}
          icon="deployed_code"
          loading={kpis.cajas.loading}
          error={kpis.cajas.error}
        />
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
        <GridCard
          title="Total palets"
          value={String(kpis.palets.value ?? "-")}
          icon="pallet"
          loading={kpis.palets.loading}
          error={kpis.palets.error}
        />
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
        <GridCard
          title="Total ubicaciones"
          value={String(kpis.ubicaciones.value ?? "-")}
          icon="grid_view"
          loading={kpis.ubicaciones.loading}
          error={kpis.ubicaciones.error}
        />
      </div>

      <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
        <GridCard
          title="Expediciones hoy"
          value={String(kpis.expedicionesHoy.value ?? "-")}
          icon="local_shipping"
          loading={kpis.expedicionesHoy.loading}
          error={kpis.expedicionesHoy.error}
        />
      </div>
    </div>
  );
}
