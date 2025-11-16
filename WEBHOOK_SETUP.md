# Configuración de Webhooks - Guía Simple

## ✅ Estado Actual

- **WhatsApp**: Configurado y verificado exitosamente
- **Messenger**: Pendiente (5 minutos)
- **Instagram**: Pendiente (5 minutos)

## 🎯 Próximos Pasos

### 1. Configurar Messenger Webhook

En https://developers.facebook.com/apps/ ve a tu aplicación:

1. **Productos** → **Messenger** → **Configuración**
2. En la sección **Webhooks**, haz clic en **Agregar URL de devolución de llamada**
3. Ingresa estos valores:
   ```
   URL de devolución de llamada:
   https://jyp-turismo.vercel.app/api/webhooks/messenger

   Token de verificación:
   jyp_turismo_messenger_2024_secure_token
   ```
4. Haz clic en **Verificar y guardar**
5. Suscríbete a los eventos: `messages`, `messaging_postbacks`

### 2. Configurar Instagram Webhook

En la misma aplicación:

1. **Productos** → **Instagram** → **Configuración**
2. En la sección **Webhooks**, haz clic en **Agregar URL de devolución de llamada**
3. Ingresa estos valores:
   ```
   URL de devolución de llamada:
   https://jyp-turismo.vercel.app/api/webhooks/instagram

   Token de verificación:
   jyp_turismo_instagram_2024_secure_token
   ```
4. Haz clic en **Verificar y guardar**
5. Suscríbete a los eventos: `messages`, `messaging_postbacks`

## 📱 Cómo Funciona (Simple)

### Cuando un cliente te envía un mensaje:

1. **Cliente** envía mensaje de WhatsApp/Messenger/Instagram
2. **Meta** recibe el mensaje automáticamente
3. **Meta** envía el mensaje a tu webhook (https://jyp-turismo.vercel.app/api/webhooks/...)
4. **Tu servidor** guarda el mensaje en la base de datos
5. **Panel de admin** muestra el mensaje automáticamente

**No tienes que hacer NADA manualmente** - todo es automático.

## 🔍 Cómo Probar

### Para WhatsApp:
1. Envía un mensaje de WhatsApp a tu número de negocio
2. El mensaje aparecerá automáticamente en: https://jyp-turismo.vercel.app/messages

### Para Messenger:
1. Envía un mensaje a tu página de Facebook
2. El mensaje aparecerá automáticamente en el mismo panel

### Para Instagram:
1. Envía un mensaje directo a tu cuenta de Instagram de negocio
2. El mensaje aparecerá automáticamente en el mismo panel

## 🔧 Variables de Entorno Necesarias

Todas ya están configuradas en Vercel:

```bash
✅ META_ACCESS_TOKEN           # Token global para WhatsApp, Messenger, Instagram
✅ WHATSAPP_VERIFY_TOKEN        # jyp_turismo_whatsapp_2024_secure_token
✅ MESSENGER_VERIFY_TOKEN       # jyp_turismo_messenger_2024_secure_token
✅ INSTAGRAM_VERIFY_TOKEN       # jyp_turismo_instagram_2024_secure_token
✅ WHATSAPP_PHONE_NUMBER_ID     # 801282023078149
✅ WHATSAPP_BUSINESS_ACCOUNT_ID # 851259567422165
✅ WHATSAPP_APP_SECRET          # bfdf7a7b0eb7f7b9570101f68486806d
✅ DATABASE_URL                 # Neon PostgreSQL
✅ NEXTAUTH_SECRET              # Para autenticación
✅ NEXTAUTH_URL                 # https://jyp-turismo.vercel.app
```

## ✨ Lo Importante

**El sistema YA está listo.** Solo falta:
1. Configurar los otros 2 webhooks (10 minutos total)
2. Enviar un mensaje de prueba
3. Ver cómo aparece automáticamente en tu panel

**No necesitas entender toda la complejidad de Meta** - el código ya maneja todo eso por ti.
