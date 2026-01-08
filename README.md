# J&P Turismo

Sistema de gestion de contenido (CMS) para operador turistico en la Region de Aysen, Patagonia Chilena.

## Descripcion

Aplicacion web con panel de administracion para gestionar el contenido del sitio publico. Permite editar secciones del sitio, administrar tours y configurar informacion de contacto sin necesidad de modificar codigo.

## Requisitos

- Node.js 18.17.0 o superior
- PostgreSQL 14 o superior
- npm 9.x o superior

## Instalacion

```bash
git clone <repository-url>
cd jyp-turismo
npm install
```

## Configuracion

Crear archivo `.env` en la raiz del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/jyp_turismo"
NEXTAUTH_SECRET="clave-secreta-de-32-caracteres-minimo"
NEXTAUTH_URL="http://localhost:3000"
```

### Base de datos

```bash
npx prisma db push
npx prisma generate
```

### Usuario administrador

```bash
npm run create-admin
```

El script solicita email, nombre y contrasena. El usuario se crea con rol ADMIN.

## Ejecucion

### Desarrollo

```bash
npm run dev
```

Disponible en `http://localhost:3000`

### Produccion

```bash
npm run build
npm run start
```

## Estructura del proyecto

```
jyp-turismo/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Panel de administracion
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Autenticacion
│   │   └── cms/                  # Endpoints del CMS
│   │       ├── content/          # GET contenido completo
│   │       ├── hero/             # PUT hero section
│   │       ├── tours/            # CRUD tours
│   │       ├── tours-section/    # PUT seccion de tours
│   │       ├── tours-page/       # PUT pagina de tours
│   │       ├── footer/           # PUT footer
│   │       ├── settings/         # PUT configuracion
│   │       └── upload/           # POST imagenes
│   ├── login/
│   │   └── page.tsx              # Pagina de login
│   ├── tours/
│   │   └── page.tsx              # Listado de tours
│   ├── home-client.tsx           # Homepage (componente cliente)
│   ├── page.tsx                  # Homepage (server component)
│   └── layout.tsx                # Layout principal
├── components/
│   ├── admin/
│   │   ├── modals/               # Modales de edicion
│   │   ├── sections/             # Secciones del panel
│   │   └── sidebar.tsx           # Navegacion lateral
│   ├── icons/
│   │   └── index.tsx             # Iconos reutilizables
│   ├── ui/
│   │   ├── form-fields.tsx       # Campos de formulario
│   │   └── modal.tsx             # Componente modal base
│   └── providers/
│       └── session-provider.tsx  # Provider de NextAuth
├── hooks/
│   └── use-form-modal.ts         # Hook para modales con formulario
├── lib/
│   ├── auth/
│   │   └── config.ts             # Configuracion NextAuth
│   ├── validations/
│   │   └── cms.ts                # Esquemas Zod
│   └── prisma.ts                 # Cliente Prisma (singleton)
├── prisma/
│   └── schema.prisma             # Esquema de base de datos
├── scripts/
│   └── create-admin.ts           # Script creacion de admin
├── types/
│   └── cms.ts                    # Tipos TypeScript
└── public/
    └── images/
        └── tours/                # Imagenes de tours
```

## Stack tecnico

| Tecnologia | Version | Uso |
|------------|---------|-----|
| Next.js | 14.0.4 | Framework React con App Router |
| React | 18.2.0 | Libreria UI |
| TypeScript | 5.3.3 | Tipado estatico |
| Prisma | 6.19.0 | ORM para PostgreSQL |
| NextAuth.js | 4.24.5 | Autenticacion |
| Tailwind CSS | 3.4.0 | Estilos |
| Framer Motion | 10.16.16 | Animaciones |
| Zod | 3.22.4 | Validacion de datos |
| bcryptjs | 2.4.3 | Hash de contrasenas |

## API

### Endpoints publicos

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/cms/content | Obtiene todo el contenido del sitio |

### Endpoints protegidos

Requieren sesion de usuario autenticado.

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| PUT | /api/cms/hero | Actualiza seccion hero |
| POST | /api/cms/tours | Crea nuevo tour |
| PUT | /api/cms/tours/[id] | Actualiza tour existente |
| DELETE | /api/cms/tours/[id] | Elimina tour |
| PUT | /api/cms/tours-section | Actualiza seccion de tours |
| PUT | /api/cms/tours-page | Actualiza pagina de tours |
| PUT | /api/cms/footer | Actualiza footer |
| PUT | /api/cms/settings | Actualiza configuracion del sitio |
| POST | /api/cms/upload | Sube imagen |

## Modelos de datos

### User
Usuarios del sistema con roles ADMIN o AGENT.

### SiteSettings
Configuracion general: nombre, logo, metadata SEO, datos de contacto, redes sociales.

### HeroSection
Contenido de la seccion principal: tagline, titulos, descripcion, imagen, botones de accion.

### ToursSection
Configuracion de la seccion de tours: titulo y descripcion.

### Tour
Tours individuales: titulo, descripcion, tags, imagen, precio, duracion, orden, estado destacado.

### ToursPage
Configuracion de la pagina de tours: titulo y subtitulo del hero.

### FooterSettings
Contenido del footer: marca, descripcion, copyright, configuracion de newsletter.

## Panel de administracion

Acceso en `/admin` despues de autenticarse en `/login`.

### Secciones disponibles

- **Dashboard**: Vista general del contenido
- **Hero**: Edicion de la seccion principal
- **Tours**: Gestion de tours (crear, editar, eliminar, reordenar)
- **Footer**: Edicion del pie de pagina
- **Configuracion**: Datos del sitio y SEO
- **Herramientas**: Sincronizacion y utilidades

## Despliegue

### Vercel

1. Importar repositorio en Vercel
2. Configurar variables de entorno:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (URL de produccion)
3. Desplegar

### Migraciones en produccion

```bash
npx prisma db push
```

## Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| npm run dev | Inicia servidor de desarrollo |
| npm run build | Genera build de produccion |
| npm run start | Inicia servidor de produccion |
| npm run lint | Ejecuta linter |
| npm run create-admin | Crea usuario administrador |

## Licencia

Todos los derechos reservados.
