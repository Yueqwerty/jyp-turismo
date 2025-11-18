🚀 Guía de Deployment - J&P Turismo Messaging

## ✅ Pre-requisitos

Antes de empezar, asegúrate de tener:
- ✅ Cuenta de GitHub (para Vercel)
- ✅ Terminal abierta en este proyecto
- ✅ Acceso a tu Meta App Dashboard (WhatsApp configurado)

**Tiempo estimado**: 20-30 minutos

---

## 📋 Checklist Rápido

1. ☐ Crear base de datos en Neon (5 min)
2. ☐ Actualizar `.env.local` con DATABASE_URL
3. ☐ Ejecutar migración local (verificar)
4. ☐ Deploy a Vercel (5 min)
5. ☐ Configurar variables de entorno en Vercel
6. ☐ Ejecutar migración en producción
7. ☐ Crear usuario administrador
8. ☐ Configurar webhooks en Meta
9. ☐ ¡Probar!

---

## 🗄️ PASO 1: Crear Base de Datos en Neon (5 minutos)

### 1.1 Crear cuenta y proyecto

1. Ve a: **https://neon.tech**
2. Click en **Sign Up** (puedes usar GitHub)
3. Click en **Create a project**
4. Configuración:
   - **Name**: `jyp-turismo-messaging`
   - **Region**: Elige el más cercano a Chile (recomendado: `US West (Oregon)` o `US East`)
   - **Postgres version**: 16 (la más reciente)
5. Click en **Create Project**

### 1.2 Obtener Connection String

1. En el Dashboard de tu proyecto, verás **Connection Details**
2. **Importante**: Selecciona **Pooled connection** (mejor rendimiento)
3. Copia la **Connection String** completa

Ejemplo de lo que verás:
```
postgresql://user:password@ep-abc123.us-west-2.aws.neon.tech/neondb?sslmode=require
```

**Guárdala**, la usarás en el siguiente paso.

---

## 🔧 PASO 2: Actualizar Variables de Entorno Locales

### 2.1 Editar .env.local

Abre `/home/user/jyp-turismo/.env.local` y actualiza:

```bash
# Database (PostgreSQL) - REEMPLAZA CON TU URL DE NEON
DATABASE_URL="postgresql://user:password@ep-abc123.us-west-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth.js - YA GENERADO PARA TI
NEXTAUTH_SECRET="2L5xFWT3LaYN1ubcXCj0EYTFTNJ1f9no62ijstDur8o="
NEXTAUTH_URL="http://localhost:3000"

# WhatsApp Business API - YA CONFIGURADO
WHATSAPP_VERIFY_TOKEN=jyp_turismo_whatsapp_2024_secure_token
WHATSAPP_ACCESS_TOKEN=EAAVVXI4tvf8BPxK1JJCxLkaEb8KAJbTdzLRGlSNKfDJS8gleVEQAs38ib3EhSNiguxDTVYJkenxNYGLHI1Ep1ZCXjVBKzZBu36BMQhp3T9yANt7TG7L8ZAEXjsa4j2loZCW7hhn1P264ENqRJOlk7BFxuvE2SenBdF49rjTeVJO4xO6kIJnLWigZAEcxkfmDKwhaHyiKMbpLFAb7Gqty46yRk0vqLI7LZAPZA2Awoq1qBjwxwAZD
WHATSAPP_PHONE_NUMBER_ID=801282023078149
WHATSAPP_BUSINESS_ACCOUNT_ID=851259567422165

# WHATSAPP_APP_SECRET - OBTENERLO DE META
# Ve a: https://developers.facebook.com/apps/ → Tu App → Settings → Basic
# Copia el "App Secret" y pégalo aquí:
WHATSAPP_APP_SECRET="TU_APP_SECRET_AQUI"

# Messenger API (configurarás después)
MESSENGER_VERIFY_TOKEN=jyp_turismo_messenger_2024_secure_token
MESSENGER_PAGE_ACCESS_TOKEN=

# Instagram API (configurarás después)
INSTAGRAM_VERIFY_TOKEN=jyp_turismo_instagram_2024_secure_token
INSTAGRAM_ACCESS_TOKEN=
```

**IMPORTANTE**: Necesitas obtener el `WHATSAPP_APP_SECRET`:
1. Ve a: https://developers.facebook.com/apps/
2. Selecciona tu app
3. **Settings → Basic**
4. Copia el **App Secret** (click en "Show")
5. Pégalo en `.env.local`

---

## 🧪 PASO 3: Verificar Migración Local

Ejecuta estos comandos para verificar que todo funciona:

```bash
# Instalar dependencias (si no lo hiciste)
npm install

# Ejecutar migración a Neon
npx prisma db push

# Ver las tablas creadas (opcional)
npx prisma studio
```

Si todo salió bien, verás:
```
✔ Database schema was successfully pushed to the database.
```

---

## 🚀 PASO 4: Deploy a Vercel (5 minutos)

### 4.1 Instalar Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Login

```bash
vercel login
```

Sigue las instrucciones en el navegador.

### 4.3 Deploy

```bash
vercel
```

Responde a las preguntas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → `N`
- **Project name?** → `jyp-turismo` (o el que prefieras)
- **In which directory?** → `.` (presiona Enter)
- **Override settings?** → `N`

Vercel hará el deploy y te dará una URL como:
```
https://jyp-turismo-abc123.vercel.app
```

**¡Guarda esta URL!** La necesitarás para los webhooks.

---

## ⚙️ PASO 5: Configurar Variables de Entorno en Vercel

### 5.1 Ve al Dashboard de Vercel

1. Ve a: **https://vercel.com/dashboard**
2. Selecciona tu proyecto (`jyp-turismo`)
3. Click en **Settings** (arriba)
4. Click en **Environment Variables** (menú izquierda)

### 5.2 Agregar TODAS estas variables

Copia cada variable de tu `.env.local` pero **IMPORTANTE**: cambia `NEXTAUTH_URL`:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://user:password@...` (de Neon) | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `2L5xFWT3LaYN1ubcXCj0EYTFTNJ1f9no62ijstDur8o=` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` | Production |
| `WHATSAPP_VERIFY_TOKEN` | `jyp_turismo_whatsapp_2024_secure_token` | Production, Preview, Development |
| `WHATSAPP_ACCESS_TOKEN` | `EAAVVXI4...` (tu token) | Production, Preview, Development |
| `WHATSAPP_PHONE_NUMBER_ID` | `801282023078149` | Production, Preview, Development |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | `851259567422165` | Production, Preview, Development |
| `WHATSAPP_APP_SECRET` | Tu App Secret de Meta | Production, Preview, Development |

**Nota**: Para cada variable, selecciona **Production, Preview, Development** en los checkboxes.

### 5.3 Re-deploy con las variables

```bash
vercel --prod
```

Esto hace un deployment de producción con todas las variables configuradas.

---

## 🗄️ PASO 6: Ejecutar Migración en Producción

```bash
# Esto ejecutará prisma db push en la base de datos de Neon
npx prisma db push
```

Verifica que se crearon las tablas:
```bash
npx prisma studio
```

Deberías ver:
- ✅ User
- ✅ Contact
- ✅ Conversation
- ✅ Message
- ✅ Attachment
- ✅ Account
- ✅ Session
- ✅ VerificationToken

---

## 👤 PASO 7: Crear Usuario Administrador

```bash
npm run create-admin
```

Responde:
- **Email**: `tu-email@ejemplo.com`
- **Nombre**: `Tu Nombre`
- **Contraseña**: `tu-contraseña-segura`

**¡Guarda estas credenciales!** Las usarás para acceder al panel.

---

## 📱 PASO 8: Configurar Webhooks en Meta

### 8.1 WhatsApp Webhook

1. Ve a: **https://developers.facebook.com/apps/**
2. Selecciona tu app
3. **WhatsApp → Configuration → Webhook**

Configura:
- **Callback URL**: `https://tu-proyecto.vercel.app/api/webhooks/whatsapp`
- **Verify token**: `jyp_turismo_whatsapp_2024_secure_token`
- Click **Verify and Save**

Si se verifica correctamente (✅ verde), continúa:
- **Subscribe to fields**: Marca `messages` y `message_status`

### 8.2 Messenger Webhook (cuando lo configures)

1. En tu Meta App → **Messenger → Settings → Webhooks**

Configura:
- **Callback URL**: `https://tu-proyecto.vercel.app/api/webhooks/messenger`
- **Verify token**: `jyp_turismo_messenger_2024_secure_token`
- **Subscribe to fields**: `messages`, `messaging_postbacks`

### 8.3 Instagram Webhook (cuando lo configures)

1. En tu Meta App → **Instagram → Configuration → Webhooks**

Configura:
- **Callback URL**: `https://tu-proyecto.vercel.app/api/webhooks/instagram`
- **Verify token**: `jyp_turismo_instagram_2024_secure_token`
- **Subscribe to fields**: `messages`, `messaging_postbacks`

---

## 🧪 PASO 9: ¡Probar!

### 9.1 Probar Login

1. Ve a: `https://tu-proyecto.vercel.app/login`
2. Usa las credenciales del admin que creaste
3. Deberías acceder al panel de mensajes

### 9.2 Probar WhatsApp

1. En Meta App Dashboard → **WhatsApp → API Setup**
2. Selecciona un número de destinatario (puedes agregar el tuyo)
3. Click **Send message**
4. Ve a: `https://tu-proyecto.vercel.app/messages`
5. **¡Deberías ver el mensaje!** 🎉

### 9.3 Ver Logs (si algo falla)

```bash
# Ver logs de Vercel en tiempo real
vercel logs --follow
```

---

## 🎯 Funcionalidades del Webhook

Una vez configurados los webhooks, tu sistema tendrá:

### ✅ WhatsApp
- ✅ **Recibir mensajes** de clientes en tiempo real
- ✅ **Tipos soportados**: Texto, imágenes, videos, audios, documentos, ubicaciones
- ✅ **Auto-crear contactos** cuando escriben por primera vez
- ✅ **Conversaciones unificadas** por número de teléfono
- ✅ **Contador de mensajes no leídos**
- ✅ **Marcar como leído** automáticamente al abrir conversación
- ✅ **Historial completo** de mensajes
- ✅ **Verificación de firma** (seguridad)

### ✅ Messenger
- ✅ **Recibir mensajes** de Facebook Messenger
- ✅ **Auto-crear contactos** de Facebook
- ✅ **Conversaciones unificadas**
- ✅ **Soporte de attachments** (imágenes, videos, etc.)

### ✅ Instagram
- ✅ **Recibir DMs** de Instagram
- ✅ **Auto-crear contactos** de Instagram
- ✅ **Conversaciones unificadas**
- ✅ **Soporte de attachments**

### 🎨 Panel de Administración
- ✅ **Vista unificada** de los 3 canales
- ✅ **Filtrar por canal** (WhatsApp, Messenger, Instagram, Todos)
- ✅ **Estadísticas en tiempo real**:
  - Total de mensajes
  - Mensajes sin leer
  - Tiempo promedio de respuesta
  - Satisfacción de clientes
- ✅ **Vista de conversación** con historial completo
- ✅ **Diseño profesional y responsivo**

---

## 📊 Monitoreo

### Ver mensajes en la base de datos

```bash
npx prisma studio
```

Navega a la tabla `Message` para ver todos los mensajes recibidos.

### Ver logs de Vercel

```bash
vercel logs --follow
```

Verás cada webhook que llega de Meta.

---

## 🐛 Troubleshooting

### Webhook no verifica
- ✅ Verifica que `VERIFY_TOKEN` coincida exactamente
- ✅ Asegúrate de que las variables estén en Vercel
- ✅ Revisa logs: `vercel logs --follow`

### Mensajes no llegan
- ✅ Verifica que el webhook esté suscrito a `messages`
- ✅ Revisa el Dashboard de Meta → Webhooks para ver errores
- ✅ Verifica que `DATABASE_URL` sea correcta

### "Invalid signature" en logs
- ✅ Verifica que `WHATSAPP_APP_SECRET` sea correcto
- ✅ Obtenerlo de: Meta App → Settings → Basic → App Secret

### No puedo hacer login
- ✅ Verifica que ejecutaste `npm run create-admin`
- ✅ Verifica que `NEXTAUTH_SECRET` esté en Vercel
- ✅ Verifica que `NEXTAUTH_URL` apunte a tu URL de Vercel

---

## 🎉 ¡Listo!

Tu sistema de mensajería unificada está funcionando 24/7 en:
```
https://tu-proyecto.vercel.app/messages
```

Todos los mensajes de WhatsApp, Messenger e Instagram llegarán automáticamente.

---

## 📞 Próximos Pasos

1. **Obtener Access Token Permanente** (WhatsApp):
   - El actual expira en 24 horas
   - Sigue las instrucciones en `SETUP.md` sección 3.4

2. **Configurar Messenger**:
   - Agregar producto Messenger a tu Meta App
   - Conectar tu Facebook Page
   - Configurar webhook

3. **Configurar Instagram**:
   - Conectar Instagram Business Account
   - Configurar webhook

4. **App Review de Meta** (para producción):
   - Solicitar permisos `pages_messaging`, `instagram_manage_messages`, `whatsapp_business_messaging`
   - Necesario para usar con más de 5 testers
