# SGCI Frontend

Frontend del Sistema de Gestion de Convocatorias Institucionales (SGCI).

La aplicacion esta construida con Angular 22, Bootstrap 5.3, Bootstrap Icons, formularios reactivos, guards por rol, interceptor JWT y graficos con Chart.js mediante ng2-charts.

## Requisitos

- Node.js 24.16.0 o version compatible con Angular 22.
- npm 11.13.0.
- Angular CLI 22.0.1.
- Backend SGCI ejecutandose en `http://localhost:8080`.

## Instalacion

Desde la raiz del frontend:

```powershell
npm install
```

Dependencias principales usadas por la aplicacion:

- `@angular/*`
- `bootstrap`
- `bootstrap-icons`
- `@popperjs/core`
- `chart.js`
- `ng2-charts`

## Configuracion

La URL del backend esta definida en:

```text
src/environments/environment.ts
```

Valor actual:

```ts
export const environment = {
  apiUrl: 'http://localhost:8080/api'
};
```

Si el backend cambia de puerto o dominio, actualizar este valor.

## Ejecutar El Proyecto

```powershell
npm start
```

Tambien se puede ejecutar con:

```powershell
ng serve
```

La aplicacion queda disponible en:

```text
http://localhost:4200
```

Si PowerShell bloquea `npm`, usar:

```powershell
npm.cmd start
```

## Compilar

```powershell
npm run build
```

Si PowerShell bloquea `npm`, usar:

```powershell
npm.cmd run build
```

La salida se genera en:

```text
dist/sgci-frontend
```

## Modulos Implementados

- Autenticacion:
  - Login.
  - Guardado de JWT.
  - Logout.
- Seguridad frontend:
  - Guard de autenticacion.
  - Guard por rol.
  - Interceptor para enviar `Authorization: Bearer TOKEN`.
- Layout:
  - Navbar y menu principal con Bootstrap.
  - Opciones visibles segun rol.
- Usuarios:
  - Listado.
  - Crear.
  - Editar.
  - Eliminar mediante soft delete en backend.
- Categorias:
  - Listado.
  - Crear.
  - Editar.
  - Eliminar mediante soft delete en backend.
- Convocatorias:
  - Listado administrativo.
  - Crear.
  - Editar.
  - Eliminar mediante soft delete en backend.
  - Consulta de convocatorias disponibles para docentes y estudiantes.
- Postulaciones:
  - Postulacion de estudiantes.
  - Consulta de mis postulaciones.
  - Gestion administrativa para aprobar o rechazar.
- Reportes:
  - Convocatorias por categoria.
  - Postulaciones por convocatoria.
  - Resultado de postulaciones.
  - Graficos con Chart.js.

## Rutas Principales

| Ruta | Acceso |
| --- | --- |
| `/login` | Publica |
| `/dashboard` | Usuario autenticado |
| `/usuarios` | Administrador |
| `/categorias` | Administrador |
| `/convocatorias` | Administrador |
| `/convocatorias-disponibles` | Docente, Estudiante |
| `/postulaciones` | Administrador |
| `/mis-postulaciones` | Estudiante |
| `/reportes` | Administrador |

## Roles

La interfaz usa los roles entregados por el backend al iniciar sesion:

- `ADMINISTRADOR`
- `DOCENTE`
- `ESTUDIANTE`

## Flujo Manual Recomendado

1. Iniciar el backend en `http://localhost:8080`.
2. Iniciar el frontend con `npm start`.
3. Entrar a `http://localhost:4200`.
4. Iniciar sesion con el usuario administrador inicial.
5. Validar usuarios, categorias, convocatorias, postulaciones y reportes.

Usuario administrador inicial:

```text
nombreUsuario: admin
clave: password123
```

## Notas

- Los estados usados en pantalla son estados de negocio recibidos desde el backend.
- Bootstrap esta configurado desde `src/styles.scss` y el bundle JavaScript de Bootstrap desde `angular.json`.
