# Configuración de Webhooks - Meta Business

## ✅ Webhooks Configurados

Todos los webhooks están listos y desplegados en producción.

---

## 📋 Configuración en Meta

Ve a: https://developers.facebook.com/apps/ → Tu Aplicación → Productos

### 1️⃣ WhatsApp

**Ubicación:** Productos → WhatsApp → Configuración → Webhook

```
URL de devolución de llamada:
https://jyp-turismo.vercel.app/api/webhooks/whatsapp

Token de verificación:
jyp_turismo_whatsapp_2024_secure_token
```

**Campos a suscribir:**
- ✅ `messages` (obligatorio)
- ✅ `message_template_status_update` (opcional - para templates)

**Estado:** ✅ VERIFICADO

---

### 2️⃣ Messenger (Facebook)

**Ubicación:** Productos → Messenger → Configuración → Webhooks

```
URL de devolución de llamada:
https://jyp-turismo.vercel.app/api/webhooks/messenger

Token de verificación:
jyp_turismo_messenger_2024_secure_token
```

**Campos a suscribir:**
- ✅ `messages`
- ✅ `messaging_postbacks`

**Pasos adicionales:**
1. Después de configurar el webhook, debes **suscribir tu Página de Facebook**
2. Ve a la sección "Agregar o quitar páginas"
3. Selecciona tu página de J&P Turismo
4. Asegúrate de suscribir a `messages` y `messaging_postbacks`

**Estado:** ⏳ POR CONFIGURAR

---

### 3️⃣ Instagram

**Ubicación:** Productos → Instagram → Configuración → Webhooks

```
URL de devolución de llamada:
https://jyp-turismo.vercel.app/api/webhooks/instagram

Token de verificación:
jyp_turismo_instagram_2024_secure_token
```

**Campos a suscribir:**
- ✅ `messages`
- ✅ `messaging_postbacks`

**Pasos adicionales:**
1. Después de configurar el webhook, debes **conectar tu cuenta de Instagram Business**
2. Ve a la sección "Agregar o quitar cuentas de Instagram"
3. Conecta tu cuenta de Instagram de negocio
4. Asegúrate de suscribir a `messages` y `messaging_postbacks`

**Estado:** ⏳ POR CONFIGURAR

---

## 🔐 Variables de Entorno (Ya Configuradas)

Todas las variables ya están en Vercel:

```bash
META_ACCESS_TOKEN=EAAVVXI4tvf8BP04tAiceS8D4fFI6N9mHNju4Jz87bde0esS3qx6j53w5zoqZBkvLD1lKZCTx2ph8mTPljZAZB9WZAvFnQlF4KYQfflTDv6Jf8cJ46VlVuyRQZBSjOf1AFn7LgRwQNpdjlXSm3RBO2fZCZCDeDuXfd5IWZBMDOlfVuFZBmuZBF8xZAPrN3K03AnxE9lPTnwZDZD

WHATSAPP_VERIFY_TOKEN=jyp_turismo_whatsapp_2024_secure_token
MESSENGER_VERIFY_TOKEN=jyp_turismo_messenger_2024_secure_token
INSTAGRAM_VERIFY_TOKEN=jyp_turismo_instagram_2024_secure_token

WHATSAPP_PHONE_NUMBER_ID=801282023078149
WHATSAPP_BUSINESS_ACCOUNT_ID=851259567422165
WHATSAPP_APP_SECRET=bfdf7a7b0eb7f7b9570101f68486806d

DATABASE_URL=postgresql://neondb_owner:npg_a9YwrompW1zy@ep-rough-night-ahn0t929-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=2L5xFWT3LaYN1ubcXCj0EYTFTNJ1f9no62ijstDur8o=
NEXTAUTH_URL=https://jyp-turismo.vercel.app
```

---

## 📱 Cómo Funcionan los Webhooks

### Flujo Automático:

```
Cliente → Envía mensaje de WhatsApp/Messenger/Instagram
    ↓
Meta → Recibe el mensaje
    ↓
Meta → Envía POST a tu webhook (https://jyp-turismo.vercel.app/api/webhooks/...)
    ↓
Tu Servidor → Verifica firma de seguridad
    ↓
Tu Servidor → Guarda en base de datos PostgreSQL
    ↓
Panel Admin → Muestra el mensaje automáticamente
```

**No tienes que hacer nada manualmente** - todo es automático.

---

## ✅ Características Implementadas

### Seguridad:
- ✅ Verificación de firma HMAC-SHA256
- ✅ Validación de tokens de verificación
- ✅ Protección contra mensajes duplicados

### Funcionalidad:
- ✅ Creación automática de contactos nuevos
- ✅ Creación automática de conversaciones
- ✅ Soporte para mensajes de texto
- ✅ Soporte para archivos adjuntos
- ✅ Manejo de errores robusto
- ✅ Logs de debugging limpios

### Base de Datos:
- ✅ Almacenamiento persistente en Neon PostgreSQL
- ✅ Historial completo de mensajes
- ✅ Contador de mensajes no leídos
- ✅ Timestamps precisos

---

## 🧪 Cómo Probar

### Paso 1: Configurar Webhooks
Sigue las instrucciones arriba para WhatsApp, Messenger e Instagram.

### Paso 2: Verificar en Meta
Cuando configures cada webhook, Meta enviará una petición de verificación. Deberías ver:
```
"Se ha realizado el test correctamente"
```

### Paso 3: Enviar Mensaje de Prueba
- **WhatsApp:** Usa el botón "Test" en Meta o envía un mensaje real
- **Messenger:** Envía un mensaje a tu página de Facebook
- **Instagram:** Envía un DM a tu cuenta de Instagram Business

### Paso 4: Ver en el Panel
Ve a: https://jyp-turismo.vercel.app/messages

Deberías ver el mensaje aparecer automáticamente.

---

## 🔍 Ver Logs (Para Debugging)

Si algo no funciona:

1. Ve a Vercel → Tu Proyecto → Logs
2. Busca líneas con:
   - ✅ `WhatsApp message processed`
   - ✅ `Messenger message processed`
   - ✅ `Instagram message processed`
   - ❌ `Error processing webhook`

Los logs te dirán exactamente qué está pasando.

---

## ⚠️ Errores Comunes

### Error: "Signature verification failed"
**Causa:** El `WHATSAPP_APP_SECRET` está mal configurado
**Solución:** Verifica que sea: `bfdf7a7b0eb7f7b9570101f68486806d`

### Error: "Unique constraint failed"
**Causa:** Mensaje duplicado (haciendo clic en "Test" varias veces)
**Solución:** Esto es normal, el sistema lo maneja automáticamente

### No llega nada al webhook
**Causa:** URL mal configurada o webhook no suscrito
**Solución:** Verifica que el webhook esté suscrito a `messages`

---

## 📞 Próximos Pasos

1. ✅ WhatsApp configurado y funcionando
2. ⏳ Configurar Messenger (5 minutos)
3. ⏳ Configurar Instagram (5 minutos)
4. ✅ Probar enviando mensajes reales
5. ✅ Verificar que aparecen en el panel

---

## 🎯 URL del Panel

**Panel de Administración:**
```
https://jyp-turismo.vercel.app/messages
```

**Credenciales:**
- Email: (tu email de admin)
- Password: (tu password de admin)

---

## ✨ Sistema Completo

Una vez configurados los 3 webhooks, tendrás:

- 📱 Un panel unificado para WhatsApp + Messenger + Instagram
- 💾 Todos los mensajes guardados en tu base de datos
- 🔐 Sistema seguro con verificación de firmas
- ⚡ Respuestas automáticas en tiempo real
- 📊 Historial completo de conversaciones
