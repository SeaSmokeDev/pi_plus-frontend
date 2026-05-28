import type { WarehouseMapItem } from "../../types/warehouseMap.types";
import Slot from "./Slot";

interface EstanteriaAlmacenProps {
  estanteriaId: number;
  huecos: WarehouseMapItem[];
  onHuecoClick?: (ubicacion: WarehouseMapItem) => void;
}

export default function EstanteriaAlmacen({ estanteriaId, huecos, onHuecoClick }: EstanteriaAlmacenProps) {
  if (huecos.length === 0) return null;

  const { descripcion } = huecos[0].estanteria;

  return (
    <div className="stock-shelf-wrapper">
      <div className="stock-shelf p-1 d-flex flex-column justify-content-between gap-1" style={{ width: "max-content" }}>
        <div className="d-flex flex-column gap-2 flex-wrap">
          {[...huecos]
            .sort((b, a) => Number(a.estanteria.nivel) - Number(b.estanteria.nivel))
            .map((ubicacion) => (
              <Slot key={ubicacion.idHueco} ubicacion={ubicacion} onClick={onHuecoClick} />
            ))}
        </div>
        <div className="fw-bold text-center stock-shelf__label" key={estanteriaId}>
          {descripcion}
        </div>
      </div>
    </div>
  );
}
