# PI-PLUS Frontend

Aplicación frontend para la gestión de almacén y terminales de pago del proyecto PI-PLUS.

## Stack técnico
- React 19
- TypeScript
- Vite
- React Router
- Bootstrap + Bootstrap Icons
- SCSS
- Google Material Symbols

## Requisitos
- Node.js 18+ (recomendado 20+)
- Backend PI-PLUS levantado y accesible

## Setup
Para preparar el entorno y levantar el proyecto, consulta:

- [Setup Frontend.md](./Setup Frontend.md)

## Autenticación
- Autenticación por sesión de backend con cookie (`credentials: "include"`).
- No se usa JWT en frontend.
- Frontend guarda solo información de usuario para UX en cookie `pi_plus_auth_user`.
- Protección de rutas privadas mediante `RequireAuth`.

## Estructura principal
```text
src/
  auth/               # Sesión, usuario autenticado, helpers de URL API
  components/         # Componentes UI por dominio
  hooks/              # Hooks de datos y lógica de vistas
  layouts/            # AppLayout (privado) y AuthLayout (login)
  pages/              # Páginas principales
  routes/             # Enrutado y protección de rutas
  services/           # Capa de acceso a API
  styles/             # SCSS global y por página/componente
  types/              # Tipos TS compartidos
```

## Rutas principales
- `/login`
- `/dashboard`
- `/search`
- `/stock`
- `/stock/ubicacion/:ubicacionId`
- `/stock/boxes/:boxId/terminals`
- `/terminal-form`
- `/expeditions`
- `/expeditions/new`
- `/expeditions/:reference/edit`

## Módulos funcionales

### 1) Login y sesión
- Inicio de sesión, validación de sesión activa y cierre de sesión.
- Normalización de errores de login para no exponer excepciones técnicas.

### 2) Dashboard de analíticas
- KPIs (terminales, cajas, palets, ubicaciones, expediciones del día).
- Gráficas de ocupación de almacén, modelos más usados y alertas operativas.
- Widgets con carga paralela y manejo de errores por bloque.

### 3) Búsqueda por serie (SN)
- Consulta de terminal por número de serie.
- Vista de detalle con estados operativos y acciones de edición/eliminación.

### 4) Mapa de almacén
- Visualización de pasillos/estanterías/huecos con ocupación.
- Modal de detalle de ubicación.
- Gestión de palets (alta, asignación, mover, desasignar, borrar según reglas).
- Gestión de cajas (alta, asignación a palet, desasignación).
- Acceso al flujo de terminales por caja.

### 5) Caja y terminales
- Alta y asignación de terminales a caja.
- Validación previa por SN.
- Asociación batch final.
- Desasignación de terminales y refresco de capacidad.

### 6) Expediciones
- Listado, filtros, creación y edición de expediciones.
- Paneles de detalle, pagos y cajas asociadas.

## Organización de carpetas (resumen)

- `src/pages/`: vistas por ruta (`Login`, `Dashboard`, `StockUbicationPage`, `BoxTerminalsPage`, `SNSearchPage`, `Expeditions...`)
- `src/components/`: componentes reutilizables por dominio (`dashboard`, `stockUbication`, `SNSearch`, `expeditions`)
- `src/services/`: integración API por contexto (`boxService`, `palletService`, `warehouseMapService`, `cajaTerminalService`, etc.)
- `src/styles/`: SCSS global y por módulo
- `src/types/`: contratos TypeScript compartidos
- `src/layouts/` y `src/routes/`: estructura de navegación y protección de rutas

## Capa de servicios (API)
Servicio base:
- `src/services/apiClient.ts` (`apiRequest`, `ApiHttpError`)

Servicios por dominio:
- `dashboardService.ts`
- `warehouseMapService.ts`
- `palletService.ts`
- `boxService.ts`
- `cajaTerminalService.ts`
- `terminalCatalogService.ts`
- `expeditionService.ts`
- `userService.ts`

## Estado actual de estilos
- Proyecto migrado a SCSS.
- Sistema de variables en `src/styles/global.scss`.
- Soporte de modo claro/oscuro con override por tema.
- Layout con header/sidebar sticky y menú lateral colapsable.

## Datos mock
Actualmente el flujo de la aplicación trabaja contra endpoints reales de backend.

El proyecto mantiene el concepto de "datos de catálogo funcionales" para negocio, por ejemplo:
- Tipos de palé (`americano`, `europeo`)
- Materiales de palé (`madera`, `plastico`)

Estos datos deben venir del backend o de catálogo controlado del dominio; no se usan mocks activos en frontend para la operativa principal.


## Autores
- Ian Tauzy
- Alba Panato Alegre

Proyecto Intermodular - FP DAW, IES Doctor Balmis.
