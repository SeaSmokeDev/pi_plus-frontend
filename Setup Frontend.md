# Setup Frontend – PI-PLUS

Guía para levantar el frontend en local.

## Requisitos
- Node.js 18+ (recomendado 20+)
- npm 9+
- Backend PI-PLUS arrancado y accesible

## 1) Instalar dependencias
```bash
npm install
```

## 2) Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8080/bdproyecto/api
```

Nota: la base URL ya incluye `/api`.

## 3) Arrancar en desarrollo
```bash
npm run dev
```

Frontend disponible por defecto en:

```text
http://localhost:5173
```

## 4) Build de producción (opcional)
```bash
npm run build
npm run preview
```

## 5) Estilos (SCSS)
El proyecto usa SCSS y Vite lo compila automáticamente.  
No hace falta ejecutar comandos extra para compilar estilos.
