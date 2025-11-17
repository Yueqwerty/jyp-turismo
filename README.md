# J&P Turismo - Sistema de Gestión de Contenido

Sistema web completo para J&P Turismo con CMS (Sistema de Gestión de Contenido) integrado. Diseño cinematográfico inspirado en Awwwards con estilo Bento Grid.

## Características

### 🎨 Diseño Cinematográfico
- Animaciones suaves con Framer Motion
- Efectos parallax multi-capa
- Glassmorphism y backdrop blur
- Bento Grid layout para tours
- Diseño responsive y accesible

### 🛠️ CMS Completo
- **Panel de Administración** - Interfaz intuitiva para gestionar todo el contenido
- **Edición en tiempo real** - Modales de edición con preview instantáneo
- **Upload de imágenes** - Sistema de carga de imágenes optimizado
- **Gestión de Tours** - Crear, editar y eliminar tours con tags dinámicos
- **Configuración del sitio** - Editar textos, imágenes, metadata y contacto
- **Autenticación segura** - NextAuth con bcrypt para passwords

### 📱 Secciones Editables

#### Hero Section
- Tagline
- Títulos (2 líneas)
- Descripción
- Cards de información (2)
- Imagen hero con badge
- CTAs (WhatsApp y Teléfono)

#### Tours (Bento Grid)
- Título de sección
- Descripción de sección
- Tours individuales:
  - Título
  - Descripción (opcional)
  - Tags personalizables
  - Imagen
  - Gradiente de respaldo
  - Featured toggle
  - Orden personalizado

#### Footer
- Título de marca
- Descripción de empresa
- Información de contacto
- Links de redes sociales
- Newsletter (con toggle)
- Texto de copyright

#### Configuración General
- Nombre de empresa
- Logo text
- Email y teléfono
- WhatsApp
- Meta tags (title, description, keywords)
- URLs de redes sociales

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Lenguaje**: TypeScript
- **Deployment**: Vercel

## Estructura del Proyecto

```
jyp-turismo/
├── app/
│   ├── admin/           # Panel de administración
│   ├── api/
│   │   ├── auth/        # NextAuth
│   │   └── cms/         # APIs del CMS
│   ├── home-client.tsx  # Homepage (client component)
│   ├── page.tsx         # Homepage (server component)
│   ├── login/           # Página de login
│   └── layout.tsx       # Layout principal
├── components/
│   └── providers/       # Providers (SessionProvider)
├── lib/
│   ├── auth/            # Configuración de NextAuth
│   └── prisma.ts        # Cliente de Prisma
├── prisma/
│   └── schema.prisma    # Schema de base de datos
└── public/
    └── images/
        └── tours/       # Imágenes de tours
```

## Instalación

### Requisitos
- Node.js 18+
- PostgreSQL
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd jyp-turismo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/jyp_turismo"

   # NextAuth
   NEXTAUTH_SECRET="tu-secret-key-muy-segura"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Ejecutar migraciones de base de datos**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

   > **Nota**: Si usas Neon PostgreSQL (como está configurado), usa `npx prisma db push` en lugar de `npx prisma migrate dev`

5. **Crear usuario administrador**
   ```bash
   npm run create-admin
   ```

   El script te pedirá:
   - Email
   - Nombre (opcional)
   - Contraseña

   El usuario será creado automáticamente con rol ADMIN

6. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

7. **Abrir navegador**
   - Sitio web: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Login: http://localhost:3000/login

## Deployment en Vercel

1. **Conectar repositorio**
   - Importar proyecto en Vercel
   - Conectar con GitHub

2. **Configurar variables de entorno**
   En Vercel Dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

3. **Deploy**
   ```bash
   git push origin claude/check-status-011hRCFpgTfcmZzQ7LQhq93d
   ```

4. **Ejecutar migraciones en producción**
   ```bash
   npx prisma db push
   ```

## Uso del CMS

### Acceder al Panel de Administración

1. Ir a `/login`
2. Ingresar credenciales de administrador
3. Redireccionará a `/admin`

### Editar Contenido

**Hero Section:**
- Click en "Editar Hero"
- Modificar campos en el modal
- Upload nueva imagen si es necesario
- Click en "Guardar"

**Tours:**
- Click en cualquier tour para editar
- O click en "+ Agregar Tour" para crear nuevo
- Agregar/eliminar tags con el botón "+"
- Upload imagen
- Toggle "Featured" para destacar
- Guardar cambios

**Footer y Settings:**
- Click en "Editar" en cada sección
- Modificar campos
- Guardar

## API Endpoints

### Públicos
- `GET /api/cms/content` - Obtener todo el contenido del sitio

### Protegidos (requieren autenticación)
- `PUT /api/cms/hero` - Actualizar Hero Section
- `POST /api/cms/tours` - Crear tour
- `PUT /api/cms/tours` - Actualizar Tours Section
- `PUT /api/cms/tours/[id]` - Actualizar tour específico
- `DELETE /api/cms/tours/[id]` - Eliminar tour
- `PUT /api/cms/settings` - Actualizar configuración del sitio
- `PUT /api/cms/footer` - Actualizar footer
- `POST /api/cms/upload` - Subir imagen

## Modelos de Base de Datos

### SiteSettings
Configuración general del sitio (logo, nombre, metadata, contacto, redes sociales)

### HeroSection
Contenido de la sección hero (tagline, títulos, descripción, info cards, imagen, CTAs)

### ToursSection
Configuración de la sección de tours (título y descripción de sección)

### Tour
Tours individuales (título, descripción, tags, imagen, configuración de grid)

### FooterSettings
Configuración del footer (brand, descripción, copyright, newsletter)

### User, Account, Session, VerificationToken
Modelos de NextAuth para autenticación

## Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ Sesiones JWT con NextAuth
- ✅ CSRF protection
- ✅ Content Security Policy
- ✅ XSS Protection headers
- ✅ Clickjacking protection
- ✅ HTTPS enforcement (HSTS)
- ✅ APIs protegidas con autenticación

## Desarrollo

### Scripts disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run create-admin # Crear usuario administrador
npx prisma studio    # Prisma Studio (DB GUI)
npx prisma db push   # Sincronizar schema con base de datos
npx prisma generate  # Generar cliente Prisma
```

### Convenciones de código
- TypeScript estricto
- ESLint para linting
- Prettier para formateo
- Conventional Commits

## Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.

## Licencia

Todos los derechos reservados © 2024 J&P Turismo
