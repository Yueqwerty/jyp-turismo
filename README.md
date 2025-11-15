# JYP Turismo - Central de Mensajería Unificada

Plataforma profesional para centralizar mensajes de WhatsApp Business, Facebook Messenger e Instagram desarrollada con Next.js 14 y desplegable en Vercel.

## Características Principales

- **Centralización Total**: Gestiona mensajes de WhatsApp Business, Messenger e Instagram desde una única plataforma
- **Tiempo Real**: Actualizaciones serverless con Next.js
- **Arquitectura Profesional**: Next.js 14 App Router con TypeScript y Prisma ORM
- **Seguridad Avanzada**: Verificación de firmas de webhooks HMAC SHA-256
- **Escalable**: Arquitectura serverless lista para producción
- **Deploy en Vercel**: Un solo click para deployment

## Tecnologías Utilizadas

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL (Vercel Postgres compatible)
- **Estilos**: Tailwind CSS
- **APIs**: Meta Graph API (WhatsApp, Messenger, Instagram)
- **Deployment**: Vercel

## Arquitectura del Proyecto

```
jyp-turismo/
├── app/
│   ├── api/webhooks/           # API Routes para webhooks
│   │   ├── whatsapp/
│   │   ├── messenger/
│   │   └── instagram/
│   ├── messages/               # Página de mensajes
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Landing page
│   └── globals.css             # Estilos globales
├── lib/
│   ├── prisma.ts               # Cliente de Prisma
│   └── services/               # Servicios de integración
│       ├── whatsapp.ts
│       ├── messenger.ts
│       └── instagram.ts
├── prisma/
│   └── schema.prisma           # Schema de base de datos
└── vercel.json                 # Configuración de Vercel
```

## Requisitos Previos

- Node.js 18.17.0 o superior
- PostgreSQL (local o cloud)
- Cuenta de Meta Business con acceso a las APIs
- Cuenta de Vercel (para deployment)

## Configuración Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Yueqwerty/jyp-turismo.git
cd jyp-turismo
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/jypturismo?schema=public"

WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_APP_SECRET=your_secret
WHATSAPP_VERIFY_TOKEN=your_verify_token

MESSENGER_ACCESS_TOKEN=your_token
MESSENGER_APP_SECRET=your_secret
MESSENGER_VERIFY_TOKEN=your_verify_token

INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_APP_SECRET=your_secret
INSTAGRAM_VERIFY_TOKEN=your_verify_token
```

### 4. Configurar Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Deploy en Vercel

### Opción 1: Deploy con GitHub (Recomendado)

1. Haz push de tu código a GitHub
2. Visita [vercel.com](https://vercel.com)
3. Click en "Add New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente Next.js
6. Configura las variables de entorno en el panel de Vercel
7. Click en "Deploy"

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

- `DATABASE_URL` (de Vercel Postgres o tu proveedor)
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN`
- `MESSENGER_ACCESS_TOKEN`
- `MESSENGER_APP_SECRET`
- `MESSENGER_VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_APP_SECRET`
- `INSTAGRAM_VERIFY_TOKEN`

## Configuración de Base de Datos en Vercel

### Usar Vercel Postgres

1. En tu proyecto de Vercel, ve a Storage
2. Click en "Create Database"
3. Selecciona "Postgres"
4. Vercel creará automáticamente la variable `DATABASE_URL`
5. Ejecuta las migraciones:

```bash
vercel env pull .env.local
npx prisma db push
```

### Alternativas de Base de Datos

- **Supabase**: PostgreSQL gratis con 500MB
- **Neon**: PostgreSQL serverless con tier gratuito
- **PlanetScale**: MySQL compatible (requiere ajustes en schema.prisma)

## Configuración de Webhooks

Una vez desplegado en Vercel, configura los webhooks en Meta:

### WhatsApp Business

1. Meta Business Manager → WhatsApp → Configuration
2. Webhook URL: `https://tu-dominio.vercel.app/api/webhooks/whatsapp`
3. Verify Token: El que configuraste en `WHATSAPP_VERIFY_TOKEN`
4. Suscríbete a: `messages`

### Messenger

1. Meta App Dashboard → Messenger → Settings
2. Webhook URL: `https://tu-dominio.vercel.app/api/webhooks/messenger`
3. Verify Token: El que configuraste en `MESSENGER_VERIFY_TOKEN`
4. Suscríbete a: `messages`, `messaging_postbacks`

### Instagram

1. Meta App Dashboard → Instagram → Configuration
2. Webhook URL: `https://tu-dominio.vercel.app/api/webhooks/instagram`
3. Verify Token: El que configuraste en `INSTAGRAM_VERIFY_TOKEN`
4. Suscríbete a: `messages`, `messaging_postbacks`

## Estructura de la Base de Datos

### Modelos Principales

- **Contact**: Contactos de clientes en cada canal
- **Conversation**: Hilos de conversación
- **Message**: Mensajes centralizados de todos los canales
- **Attachment**: Archivos adjuntos (imágenes, videos, documentos)

## Endpoints de API

### Webhooks

- `GET/POST /api/webhooks/whatsapp` - Webhook de WhatsApp Business
- `GET/POST /api/webhooks/messenger` - Webhook de Messenger
- `GET/POST /api/webhooks/instagram` - Webhook de Instagram

## Características de Seguridad

- Verificación de firmas HMAC SHA-256 para todos los webhooks
- Validación de tokens de verificación
- Conexiones HTTPS obligatorias
- Sanitización de entrada con Prisma
- Variables de entorno seguras

## Scripts Disponibles

```bash
npm run dev         # Inicia servidor de desarrollo
npm run build       # Construye para producción
npm start           # Inicia servidor de producción
npm run lint        # Ejecuta el linter
```

## Comandos de Prisma

```bash
npx prisma generate     # Genera el cliente de Prisma
npx prisma db push      # Sincroniza schema con la base de datos
npx prisma studio       # Abre interfaz visual de la BD
npx prisma migrate dev  # Crea nueva migración
```

## Troubleshooting

### Error: No DATABASE_URL

Asegúrate de que la variable `DATABASE_URL` esté configurada en `.env` o en Vercel.

### Error de Prisma en Build

Ejecuta `npx prisma generate` antes de hacer build.

### Webhooks no funcionan

1. Verifica que las URLs de webhook sean HTTPS
2. Confirma que los tokens de verificación coincidan
3. Revisa los logs en Vercel Dashboard

## Costos Estimados

- **Vercel**: Gratis para proyectos hobby
- **Vercel Postgres**: Gratis hasta 256MB
- **Alternativas de BD gratuitas**: Supabase, Neon, Railway

Total: **$0/mes** para empezar (con limitaciones de uso)

## Contribución

Las contribuciones son bienvenidas:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas:

- Email: soporte@jypturismo.com
- Issues: https://github.com/Yueqwerty/jyp-turismo/issues

## Roadmap

- [ ] Panel de analytics y métricas
- [ ] Respuestas automáticas con IA
- [ ] Integración con CRM
- [ ] Sistema de etiquetas y categorías
- [ ] Plantillas de mensajes
- [ ] Asignación de agentes
- [ ] Notificaciones push
- [ ] Exportación de conversaciones

---

Desarrollado con profesionalismo usando Next.js 14, Prisma, PostgreSQL y Tailwind CSS
