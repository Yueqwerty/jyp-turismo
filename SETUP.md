# 📱 Configuración del Sistema de Mensajería Unificada - J&P Turismo

## 🎯 Visión General

Este sistema centraliza los mensajes de **WhatsApp, Messenger e Instagram** en un solo panel de administración.

---

## 📋 Requisitos Previos

✅ **Meta Business Account** (gratuito)
✅ **Facebook Page** verificada
✅ **Instagram Business Account** conectado a Facebook Page
✅ **Número de teléfono** para WhatsApp Business API
✅ **Base de datos PostgreSQL** (Railway, Neon, Supabase, Vercel Postgres)
✅ **Dominio con HTTPS** (obligatorio para webhooks)

---

## 🗄️ Paso 1: Configurar Base de Datos

### Opción A: Railway (Recomendado - Gratis)

1. Ve a https://railway.app
2. Crea una cuenta
3. **New Project** → **Provision PostgreSQL**
4. Copia la **DATABASE_URL** desde "Connect"
5. Pégala en `.env.local`

### Opción B: Neon (Serverless PostgreSQL)

1. Ve a https://neon.tech
2. Crea un proyecto
3. Copia la **Connection String**
4. Pégala en `.env.local`

### Opción C: Supabase (PostgreSQL + Dashboard)

1. Ve a https://supabase.com
2. Crea un proyecto
3. **Settings → Database → Connection string**
4. Copia la URL y pégala en `.env.local`

### Configurar el Schema

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar migración
npx prisma db push

# 3. Verificar que se crearon las tablas
npx prisma studio
```

---

## 🚀 Paso 2: Deploy a Producción (Vercel)

Los webhooks de Meta **requieren HTTPS**, así que debes deployar primero:

```bash
# 1. Conectar con Vercel
npm install -g vercel
vercel login

# 2. Deploy
vercel

# 3. Agrega las variables de entorno en Vercel Dashboard:
#    - DATABASE_URL
#    - NEXTAUTH_SECRET (genera uno: openssl rand -base64 32)
#    - NEXTAUTH_URL (tu URL de Vercel)
#    - WHATSAPP_VERIFY_TOKEN
#    - WHATSAPP_ACCESS_TOKEN
#    - WHATSAPP_PHONE_NUMBER_ID
#    - WHATSAPP_BUSINESS_ACCOUNT_ID
#    - WHATSAPP_APP_SECRET

# 4. Ejecuta la migración en producción
vercel env pull .env.production
npx prisma db push
```

**Tu URL de producción será**: `https://tu-proyecto.vercel.app`

---

## 📱 Paso 3: Configurar WhatsApp Business API

### 3.1 Crear Meta App

1. Ve a https://developers.facebook.com/apps/
2. **Create App** → **Business**
3. Nombre: "J&P Turismo Messaging"
4. Elige tu **Meta Business Account**

### 3.2 Configurar WhatsApp

1. En el Dashboard de tu App, click **Add Product** → **WhatsApp**
2. En "API Setup", verás:
   - **Temporary Access Token** (copiarlo a `.env.local` como `WHATSAPP_ACCESS_TOKEN`)
   - **Phone Number ID** (copiarlo a `.env.local` como `WHATSAPP_PHONE_NUMBER_ID`)
   - **WhatsApp Business Account ID** (copiarlo a `.env.local`)

### 3.3 Configurar Webhook de WhatsApp

En **WhatsApp → Configuration → Webhook**:

1. **Callback URL**: `https://tu-proyecto.vercel.app/api/webhooks/whatsapp`
2. **Verify Token**: `jyp_turismo_whatsapp_2024_secure_token` (el mismo de `.env.local`)
3. Click **Verify and Save**

4. **Subscribe to fields**:
   - ✅ `messages`
   - ✅ `message_status`

### 3.4 Obtener Access Token Permanente

El token temporal expira en 24 horas. Para obtener uno permanente:

1. Ve a **Settings → App Roles → Assign People**
2. Agrega usuarios administradores
3. Ve a **WhatsApp → Configuration → System Users**
4. Crea un **System User** con rol Admin
5. **Generate Token** con permisos:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. **Copia el token permanente** y reemplaza `WHATSAPP_ACCESS_TOKEN` en Vercel

### 3.5 Obtener App Secret

1. **Settings → Basic** (en tu Meta App)
2. Copia el **App Secret**
3. Agrégalo como `WHATSAPP_APP_SECRET` en `.env.local` y Vercel

### 3.6 Verificar el Webhook

Para probar que el webhook funciona:

```bash
# Ver logs en Vercel
vercel logs --follow
```

Luego envía un mensaje de prueba desde el panel de Meta:

1. En **WhatsApp → API Setup**, selecciona un **número de destinatario**
2. Click **Send message**
3. Deberías ver el mensaje en los logs de Vercel y en tu base de datos

---

## 💬 Paso 4: Configurar Messenger

### 4.1 Agregar Messenger Product

1. En tu Meta App, **Add Product** → **Messenger**

### 4.2 Conectar Facebook Page

1. En **Messenger → Settings**, click **Add or Remove Pages**
2. Selecciona tu página de Facebook
3. **Generate Token** → guárdalo como `MESSENGER_PAGE_ACCESS_TOKEN`

### 4.3 Configurar Webhook de Messenger

En **Messenger → Settings → Webhooks**:

1. **Callback URL**: `https://tu-proyecto.vercel.app/api/webhooks/messenger`
2. **Verify Token**: `jyp_turismo_messenger_2024_secure_token`
3. **Subscribe to fields**:
   - ✅ `messages`
   - ✅ `messaging_postbacks`

---

## 📸 Paso 5: Configurar Instagram

### 5.1 Conectar Instagram Business Account

Tu Instagram debe ser una **cuenta de empresa** conectada a tu Facebook Page.

### 5.2 Agregar Instagram Product

1. **Add Product** → **Instagram**
2. **Add Instagram Account** → selecciona tu cuenta

### 5.3 Configurar Webhook de Instagram

En **Instagram → Configuration → Webhooks**:

1. **Callback URL**: `https://tu-proyecto.vercel.app/api/webhooks/instagram`
2. **Verify Token**: `jyp_turismo_instagram_2024_secure_token`
3. **Subscribe to fields**:
   - ✅ `messages`
   - ✅ `messaging_postbacks`

---

## 🔐 Paso 6: App Review (Para Producción)

Para usar las APIs en producción (más de 5 testers), necesitas **App Review de Meta**:

### 6.1 Permisos a Solicitar

1. Ve a **App Review → Permissions and Features**
2. Solicita:
   - `pages_messaging`
   - `instagram_manage_messages`
   - `whatsapp_business_messaging`

### 6.2 Información Requerida

- **Caso de uso**: Servicio de atención al cliente para empresa de turismo
- **Video demo**: Graba un video mostrando cómo usas el panel de mensajes
- **Instrucciones de prueba**: Explica cómo Meta puede probar tu app

**Tiempo de aprobación**: 1-3 días hábiles

---

## 👤 Paso 7: Crear Usuario Administrador

```bash
# Generar password hash y crear admin
npm run create-admin
```

Sigue las instrucciones para crear tu usuario admin.

---

## 🧪 Paso 8: Probar el Sistema Completo

### 8.1 Probar WhatsApp

1. Guarda el número de WhatsApp Business en tu teléfono
2. Envía un mensaje: "Hola, quisiera información sobre tours"
3. Ve a `https://tu-proyecto.vercel.app/messages`
4. Deberías ver el mensaje en el panel

### 8.2 Probar Messenger

1. Ve a tu Facebook Page
2. Envía un mensaje como usuario
3. Verifica que aparezca en el panel

### 8.3 Probar Instagram

1. Envía un DM a tu Instagram Business
2. Verifica que aparezca en el panel

---

## 📊 Variables de Entorno Completas

Copia esto a tu `.env.local` y completa los valores:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://usuario:password@host:5432/jyp_turismo?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="genera_con: openssl rand -base64 32"
NEXTAUTH_URL="https://tu-proyecto.vercel.app"

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN="jyp_turismo_whatsapp_2024_secure_token"
WHATSAPP_ACCESS_TOKEN="[Token permanente de Meta]"
WHATSAPP_PHONE_NUMBER_ID="801282023078149"
WHATSAPP_BUSINESS_ACCOUNT_ID="851259567422165"
WHATSAPP_APP_SECRET="[App Secret de Meta]"

# Messenger API
MESSENGER_VERIFY_TOKEN="jyp_turismo_messenger_2024_secure_token"
MESSENGER_PAGE_ACCESS_TOKEN="[Page Access Token]"

# Instagram API
INSTAGRAM_VERIFY_TOKEN="jyp_turismo_instagram_2024_secure_token"
INSTAGRAM_ACCESS_TOKEN="[Instagram Access Token]"
```

---

## 💰 Costos

- **WhatsApp**: Primeras 1,000 conversaciones/mes **GRATIS**, luego ~$0.005-0.02 USD/conversación
- **Messenger**: **GRATIS** ilimitado
- **Instagram**: **GRATIS** ilimitado
- **Base de datos**:
  - Railway: $5/mes (512MB RAM)
  - Neon: **GRATIS** hasta 0.5GB
  - Supabase: **GRATIS** hasta 500MB
- **Hosting**: Vercel **GRATIS** (Hobby plan)

---

## 🐛 Troubleshooting

### Webhook no verifica

- Verifica que `VERIFY_TOKEN` en `.env.local` coincida exactamente
- Asegúrate de que la URL usa HTTPS
- Revisa los logs: `vercel logs --follow`

### Mensajes no llegan

- Verifica que los webhooks estén suscritos a los campos correctos
- Revisa la **App Dashboard → Webhooks** para ver errores
- Verifica que `DATABASE_URL` sea correcta

### "Invalid signature" en logs

- Verifica que `WHATSAPP_APP_SECRET` sea correcto
- El webhook verifica la firma para seguridad

### No puedo enviar mensajes

- Solo puedes responder a mensajes en las primeras 24 horas
- Para mensajes proactivos necesitas plantillas aprobadas

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `vercel logs --follow`
2. Verifica Prisma Studio: `npx prisma studio`
3. Consulta la documentación de Meta: https://developers.facebook.com/docs/whatsapp

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de mensajería unificada. Todos los mensajes de WhatsApp, Messenger e Instagram llegarán a `https://tu-proyecto.vercel.app/messages`.
