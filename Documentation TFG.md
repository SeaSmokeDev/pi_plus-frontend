# Documentación TFG - Frontend de Gestión de Almacén y Terminales

## 1. Introducción y objetivos

Este proyecto implementa el frontend de una aplicación logística para la gestión de:

- terminales de pago,
- cajas,
- palés,
- y ubicaciones de almacén.

La aplicación está orientada a operativa real de almacén: alta de elementos, asignación/desasignación, validación de reglas de negocio y visualización del estado del inventario.

### Objetivos funcionales

1. Permitir login de usuario con sesión segura.
2. Consultar estado global del sistema desde un dashboard analítico.
3. Gestionar el mapa de almacén con detalle por hueco (pasillo/estantería/nivel).
4. Crear y asignar palés/cajas respetando compatibilidades de marca/modelo.
5. Añadir/quitar terminales en cajas con validaciones de backend.
6. Gestionar expediciones y su estado operativo.

---

## 2. Análisis funcional

### Módulos principales

- **Autenticación**: acceso con usuario/contraseña y sesión por cookie.
- **Dashboard**: KPIs y paneles de estado del almacén.
- **Mapa de almacén**: vista de ocupación por pasillos y huecos.
- **Gestión de palés/cajas**:
  - Crear palé en hueco.
  - Asignar palé existente.
  - Crear caja.
  - Asignar caja existente al palé.
  - Desasignar/Eliminar según reglas.
- **Gestión de terminales por caja**:
  - Añadir SN manual o escaneado.
  - Validar compatibilidad/estado.
  - Asociar en batch.
  - Desasignar terminal individual.
- **Búsqueda por SN**: consulta y edición de terminal.
- **Expediciones**: listado, filtros, detalle y creación.

### Reglas de negocio destacadas

- Un palé define una **marca permitida** para sus cajas.
- Una caja no debe mezclar terminales incompatibles con su modelo.
- Desasignaciones y eliminaciones se hacen con confirmación.
- El backend es la fuente de verdad de validaciones críticas.

---

## 3. Arquitectura técnica

### Frontend

- React + TypeScript
- Vite
- SCSS modular por página/componente
- React Router para navegación

### Patrón de integración

- Capa de servicios (`src/services/*`) para centralizar llamadas API.
- Cliente común `apiRequest` con:
  - `credentials: "include"`
  - parseo de error backend
  - manejo homogéneo de errores HTTP y de negocio.

### Estructura simplificada

- `src/pages`: pantallas principales.
- `src/components`: UI reutilizable y widgets por módulo.
- `src/services`: acceso a API por dominio (cajas, palés, mapa, dashboard, etc.).
- `src/styles`: SCSS global + SCSS por módulo.
- `src/types`: tipos de datos compartidos.

---

## 4. Modelo de datos y entidades (visión frontend)

Entidades principales consumidas:

- **Terminal**: `numeroSerie`, `marca`, `modelo`, `estado`, `cajaId`.
- **Caja**: `id`, `etiqueta`, `modeloProducto`, `maxCapacity`, `paletId`.
- **Palé**: `id`, `material`, `tipo`, `codigoMarca`, `descripcion`, `ubicacionAlmacenId`, `cajas[]`.
- **Ubicación**: `idHueco` (visual), `ubicacionAlmacenId` (PK real), `pasillo`, `estanteria`, `pale`, `ocupacionActual`, `cajas[]`.
- **Expedición**: fechas, estado, destino, usuario, referencia.

> Nota: en operaciones de escritura de ubicación/palé se usa siempre `ubicacionAlmacenId` (id real de BD), no `idHueco` visual.

---

## 5. Diseño de frontend (rutas, layouts, componentes, estado)

### Layout

- `Header` sticky con información de usuario y switch claro/oscuro.
- `Sidebar` sticky/collapsable con navegación principal.
- Contenido principal responsive con cards y tablas.

### Rutas principales

- `/login`
- `/` (dashboard)
- `/stock` (mapa de almacén)
- `/stock/boxes/:id/terminals` (gestión de terminales por caja)
- `/sn-search` (búsqueda por SN)
- `/expeditions` (expediciones)

### Gestión de estado

- Estado local con hooks (`useState`, `useEffect`, `useMemo`).
- Estados por widget: `loading`, `error`, `data` para evitar bloquear toda la pantalla.
- Mensajería contextual (alerts/toast) tras acciones de negocio.

---

## 6. Integración con API y reglas de negocio

## 6.1 Autenticación

### Endpoint

- `POST /api/auth/login`
- `GET /api/auth/user`
- `POST /api/auth/logout`

### Datos y flujo

- Login envía credenciales.
- Backend responde con sesión por cookie HttpOnly.
- Frontend no guarda token manualmente; mantiene sesión vía cookie automática.

### Ejemplo request login

```json
{
  "username": "cmartinez",
  "password": "*****"
}
```

### Ejemplo error (credenciales)

```json
{
  "error": "BadCredentialsException",
  "message": "Error en usuario o contraseña"
}
```

---

## 6.2 Dashboard analítico

### Endpoints

- `GET /api/terminales/count`
- `GET /api/cajas/count`
- `GET /api/palets/count`
- `GET /api/ubicaciones/count`
- `GET /api/expediciones/today/list`
- `GET /api/terminales`
- `GET /api/cajas`
- `GET /api/ubicaciones/mapa`

### Datos obtenidos

- KPIs globales (totales).
- Distribución por estado de terminal.
- Modelos más usados en cajas.
- Ocupación por pasillo.

### Ejemplo respuesta count

```json
{
  "count": 267
}
```

### Ejemplo respuesta mapa para analítica

```json
[
  {
    "idHueco": 1,
    "ubicacionAlmacenId": 1,
    "pasillo": { "id": 1, "numero": 1 },
    "estanteria": { "id": 1, "descripcion": "A", "nivel": 1, "capacidadMaxCajas": 8 },
    "pale": null,
    "ocupacionActual": 0,
    "cajas": []
  }
]
```

---

## 6.3 Mapa de almacén

### Endpoint principal

- `GET /api/ubicaciones/mapa`

### Datos obtenidos

- Huecos reales de almacén con ocupación.
- Información resumida para pintar pasillos/estanterías.
- Detalle de palé y cajas por hueco.

### Escenario A: hueco vacío

```json
{
  "idHueco": 22,
  "ubicacionAlmacenId": 22,
  "referencia": "2C1",
  "pasillo": { "id": 2, "numero": 2 },
  "estanteria": { "id": 3, "descripcion": "C", "nivel": 1, "capacidadMaxCajas": 8 },
  "pale": null,
  "ocupacionActual": 0,
  "cajas": []
}
```

### Escenario B: hueco con palé y cajas

```json
{
  "idHueco": 8,
  "ubicacionAlmacenId": 8,
  "referencia": "1C2",
  "pasillo": { "id": 1, "numero": 1 },
  "estanteria": { "id": 3, "descripcion": "C", "nivel": 2, "capacidadMaxCajas": 8 },
  "pale": {
    "id": 5,
    "descripcion": "",
    "material": "madera",
    "tipo": "europeo",
    "capacidadMaxCajas": 8,
    "codigoMarca": "PAX"
  },
  "ocupacionActual": 2,
  "cajas": [
    { "id": 10, "etiqueta": "1-C-2-1", "modeloProducto": "PAX A920", "maxCapacity": 90 },
    { "id": 11, "etiqueta": "1-C-2-2", "modeloProducto": "PAX A920", "maxCapacity": 90 }
  ]
}
```

---

## 6.4 Gestión de palés

### Endpoints usados

- `POST /api/palets` (crear palé)
- `GET /api/palets/free` (palés libres)
- `GET /api/palets/{id}` (detalle palé)
- `PATCH /api/palets/{id}/ubicacion` (mover/desasignar de hueco)
- `PATCH /api/palets/{id}/descripcion` (actualizar descripción del palé)
- `DELETE /api/palets/{id}` (borrar palé)

### Crear palé (request)

```json
{
  "descripcion": "Palet recepción Verifone",
  "material": "madera",
  "tipo": "europeo",
  "capacidadMaxCajas": 8,
  "codigoMarca": "Verifone",
  "ubicacionAlmacenId": 14,
  "cajas": []
}
```

### Mover palé de ubicación

```json
{
  "ubicacionAlmacenId": 4
}
```

### Actualizar descripción tras mover palé

```json
{
  "descripcion": "Pasillo 2 - Estantería A - Nivel 1"
}
```

### Flujo real en frontend (secuencial)

1. `PATCH /api/palets/{id}/ubicacion`
2. Si OK, `PATCH /api/palets/{id}/descripcion`
3. Refresco de mapa y detalle del palé

Si falla solo el paso 2, el palé se mantiene movido y se muestra warning no bloqueante.

### Desasignar palé de ubicación

```json
{
  "ubicacionAlmacenId": null
}
```

### Escenario error ejemplo

```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Could not write JSON..."
}
```

---

## 6.5 Gestión de cajas

### Endpoints usados

- `POST /api/cajas`
- `GET /api/cajas/free`
- `GET /api/cajas/free/marca/{marca}`
- `PATCH /api/cajas/{id}/palet`
- `DELETE /api/palets/{paletId}/cajas/{cajaId}` (desasignar caja de palé)

### Crear caja (request esperado)

```json
{
  "etiqueta": "1-C-1-1",
  "modeloProducto": "PAX A920",
  "maxCapacity": 90,
  "paletId": null
}
```

### Asignar caja existente a palé

```json
{
  "paletId": 5
}
```

### Regla aplicada

- Solo se muestran/permiten cajas compatibles con la marca del palé cuando el palé ya está definido.

---

## 6.6 Gestión de terminales por caja

### Endpoints usados

- `POST /api/cajas/{id}/validar-terminal`
- `POST /api/cajas/{id}/terminales`
- `DELETE /api/cajas/{id}/terminales/{sn}`
- `GET /api/cajas/{id}/capacidad`
- `GET /api/cajas/{id}` (precarga datos de caja/terminales)

### Estados de terminal y regla de asignación a caja

Permitidos:

- `operativo` (verde)
- `pendiente_laboratorio` (naranja)
- `pendiente_revision` (azul)

No permitidos para asociar:

- `en_transito` (rojo)
- `pendiente_transito` (rojo)
- `nivel_1` (gris)

Regla UI:

- El botón **Enviar** se deshabilita si existe al menos un terminal con estado no permitido.

### Validar terminal (request)

```json
{
  "sn": "SN10025"
}
```

### Validar terminal (escenario válido)

```json
{
  "valido": true,
  "motivo": null,
  "terminal": {
    "sn": "SN10025",
    "marca": "Ingenico",
    "modelo": "Move5000",
    "estado": "operativo"
  },
  "caja": {
    "id": 13,
    "modeloProducto": "Ingenico Move5000"
  }
}
```

### Validar terminal (escenario inválido)

```json
{
  "valido": false,
  "motivo": "MODELO_NO_COMPATIBLE",
  "terminal": {
    "sn": "SN10025",
    "marca": "Ingenico",
    "modelo": "Move5000",
    "estado": "operativo"
  },
  "caja": {
    "id": 13,
    "modeloProducto": "PAX A920"
  }
}
```

### Asociar terminales (batch)

```json
{
  "sns": ["SN10001", "SN10002"]
}
```

### Respuesta éxito batch

```json
{
  "success": true,
  "cajaId": 13,
  "terminalesAsociados": [
    { "sn": "SN10001", "estado": "ASOCIADO" },
    { "sn": "SN10002", "estado": "ASOCIADO" }
  ],
  "errores": []
}
```

### Respuesta error batch

```json
{
  "success": false,
  "motivo": "ALGUNOS_TERMINALES_INVALIDOS",
  "errores": [
    { "sn": "SN10002", "motivo": "ESTADO_NO_VALIDO" }
  ]
}
```

### Capacidad de caja

```json
{
  "cajaId": 13,
  "terminalesActuales": 2,
  "capacidadMaxima": 90
}
```

---

## 6.7 Búsqueda por SN

### Endpoints usados

- `GET /api/terminales/sn/{numeroSerie}`
- `PUT /api/terminales/sn/{numeroSerie}`
- `DELETE /api/terminales/sn/{numeroSerie}` (si aplica en flujo)

### Datos obtenidos

- Ficha de terminal por SN.
- Estados y edición condicionada por reglas (p.ej. en tránsito).

---

## 6.8 Expediciones

### Endpoints usados (según vista)

- `GET /api/expediciones/list`
- `GET /api/expediciones/today/list`
- `GET /api/expediciones/grouped/today`
- `GET /api/expediciones/search?...`
- `GET /api/expediciones/grouped/search?...`
- `GET /api/expediciones/{id}`
- `POST /api/expediciones` (creación)

### Datos obtenidos

- Listado de expediciones y agrupación.
- Estado, destino, usuario, fechas.
- Filtros de consulta.

---

## 7. Seguridad y autenticación (sesión por cookie)

- Se usa sesión de servidor con cookie.
- Frontend siempre envía `credentials: "include"`.
- No se almacena token JWT en localStorage/sessionStorage.
- En caso de `403`, se informa al usuario y se redirige según flujo.

Ventaja:

- Menor exposición en cliente frente a token persistente.

---

## 8. Pruebas y validaciones funcionales

### Casos probados recomendados

1. Login correcto/incorrecto.
2. Carga dashboard con fallos parciales por widget.
3. Mapa con huecos vacíos y ocupados.
4. Crear palé nuevo y asignar existente.
5. Crear caja y asignar caja existente.
6. Validación SN (existe/no existe/estado no válido/modelo incompatible).
7. Asociación batch todo-ok / con errores.
8. Desasignar terminal/caja/palé.
9. Eliminar palé con y sin cajas asociadas.

### Criterios de calidad

- Mensajes de error legibles al usuario (no SQL crudo).
- Refresco de bloques afectados tras mutaciones.
- Coherencia visual en modo claro/oscuro.

---

## 9. Despliegue y configuración

Para preparar el entorno y ejecutar el frontend:

- Revisar **[Setup Frontend.md](./Setup Frontend.md)**.

Incluye:

- requisitos,
- variable `VITE_API_BASE_URL`,
- comandos `npm install` y `npm run dev`.

---

## 10. Conclusiones y mejoras futuras

### Conclusiones

- El frontend está desacoplado por capa de servicios.
- Las reglas de negocio críticas se validan en backend.
- La UI refleja estado operativo real de almacén con flujos completos de alta/asignación/desasignación.

### Mejoras futuras

1. Catálogo completo backend para `material` y `tipo` de palé (actualmente valores controlados en UI).
2. Auditoría de operaciones (quién mueve/desasigna cada recurso).
3. Más telemetría en dashboard (tendencias temporales, comparativas).
4. Tests E2E automáticos (Playwright/Cypress).
5. Internacionalización y accesibilidad avanzada.

---

## Anexos

### A. Endpoints por pantalla

- Login: `/api/auth/login`, `/api/auth/user`, `/api/auth/logout`
- Dashboard: `/api/*/count`, `/api/ubicaciones/mapa`, `/api/terminales`, `/api/cajas`, `/api/expediciones/*`
- Stock/Mapa: `/api/ubicaciones/mapa`, `/api/palets/*`, `/api/cajas/*`
- Caja-terminales: `/api/cajas/{id}/*`
- SN Search: `/api/terminales/sn/*`
- Expediciones: `/api/expediciones/*`

### B. Notas de catálogo actual

- **Marca permitida del palé**: backend (`/catalogo/terminales/marcas`).
- **Modelos por marca**: backend (`/catalogo/terminales/marcas/{marca}/modelos`).
- **Capacidad máxima de caja**: backend (endpoint de catálogo de cajas vigente en integración).
- **Material/Tipo de palé**: valores controlados en frontend (`madera|plastico`, `europeo|americano`) a la espera de catálogo backend dedicado.
