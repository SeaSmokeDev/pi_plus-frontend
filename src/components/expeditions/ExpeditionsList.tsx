import ExpeditionCard from "./ExpeditionCard";
import type { Expedition } from "../../types";

type ExpeditionsListProps = {
  expeditions: Expedition[];
  onEdit?: (expedition: Expedition) => void;
};

export default function ExpeditionsList({ expeditions, onEdit }: ExpeditionsListProps) {
  if (expeditions.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body py-5 text-center">
          <span className="material-symbols-outlined text-muted mb-2" style={{ fontSize: "2rem" }}>
            inventory
          </span>
          <h2 className="h5">No hay expediciones que coincidan</h2>
          <p className="text-muted mb-0">
            Ajusta los filtros para volver a ver expediciones del dia.
          </p>
        </div>
      </div>
    );
  }

  const shouldScroll = expeditions.length > 5;

  return (
    <div
      className="rounded-3 p-2"
      style={{
        maxHeight: shouldScroll ? "560px" : undefined,
        overflowY: shouldScroll ? "auto" : undefined,
      }}
    >
      <div className="row g-3">
        {expeditions.map((expedition) => (
          <div key={expedition.id} className="col-12">
            <ExpeditionCard expedition={expedition} onEdit={onEdit} />
          </div>
        ))}
      </div>
    </div>
  );
}
