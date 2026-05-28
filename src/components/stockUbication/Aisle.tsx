import type { WarehouseMapItem } from "../../types/warehouseMap.types";
import Shelf from "./Shelf";

interface PasilloAlmacenProps {
  pasilloId: number;
  numero: number;
  ubicaciones: WarehouseMapItem[];
  onHuecoClick?: (ubicacion: WarehouseMapItem) => void;
}

export default function PasilloAlmacen({ pasilloId, numero, ubicaciones, onHuecoClick }: PasilloAlmacenProps) {
  if (ubicaciones.length === 0) return null;

  const estanteriasMap = new Map<number, WarehouseMapItem[]>();

  ubicaciones.forEach((ubicacion) => {
    const estanteriaId = ubicacion.estanteria.id;

    if (!estanteriasMap.has(estanteriaId)) {
      estanteriasMap.set(estanteriaId, []);
    }

    estanteriasMap.get(estanteriaId)?.push(ubicacion);
  });

  return (
    <div className="mt-3">
      <div className="stock-aisle-track px-3 rounded-1 d-flex justify-content-start gap-4 align-items-end">
        {Array.from(estanteriasMap.entries())
          .sort(([, huecosX], [, huecosY]) => huecosX[0].estanteria.descripcion.localeCompare(huecosY[0].estanteria.descripcion))
          .map(([estanteriaId, huecos]) => (
            <Shelf key={estanteriaId} estanteriaId={estanteriaId} huecos={huecos} onHuecoClick={onHuecoClick} />
          ))}
      </div>
      <h4 key={pasilloId} className="fw-lighter px-2 stock-aisle-title">
        Pasillo {numero}
      </h4>
    </div>
  );
}
