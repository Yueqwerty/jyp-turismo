# 🎯 Funcionalidades del Sistema de Webhooks

## 📱 WhatsApp Business API

### ✅ Mensajes Entrantes (INBOUND)
- **Texto**: Mensajes de texto simples
- **Imágenes**: Fotos enviadas por clientes (con caption opcional)
- **Videos**: Videos enviados por clientes (con caption opcional)
- **Audios**: Mensajes de voz
- **Documentos**: PDFs, Word, Excel, etc.
- **Ubicaciones**: Localización compartida por el cliente
- **Contactos**: Tarjetas de contacto vCard

### 🔄 Procesamiento Automático
1. **Recepción en tiempo real** vía webhook
2. **Verificación de firma** (seguridad Meta)
3. **Auto-creación de contacto** si es primera vez que escribe
4. **Creación de conversación** única por número de teléfono
5. **Almacenamiento en base de datos** PostgreSQL
6. **Extracción de metadata**:
   - Nombre del contacto (si disponible)
   - Número de teléfono
   - Tipo de mensaje
   - Timestamp exacto
   - ID del mensaje (para evitar duplicados)

### 📊 Gestión de Conversaciones
- **Conversaciones unificadas** por número de WhatsApp
- **Contador de mensajes no leídos** (`unreadCount`)
- **Último mensaje** visible en lista
- **Auto-marcar como leído** al abrir conversación
- **Historial completo** de toda la conversación
- **Ordenamiento** por mensaje más reciente primero

### 🔔 Estados de Mensaje
- `PENDING`: Mensaje en proceso de envío
- `SENT`: Mensaje enviado exitosamente
- `DELIVERED`: Mensaje entregado al cliente
- `READ`: Mensaje leído por el cliente
- `FAILED`: Error en el envío

---

## 💬 Messenger (Facebook)

### ✅ Mensajes Entrantes
- **Texto**: Mensajes de texto
- **Attachments**: Imágenes, videos, GIFs, stickers
- **Postbacks**: Respuestas de botones interactivos
- **Quick Replies**: Respuestas rápidas

### 🔄 Procesamiento Automático
1. **Recepción vía webhook**
2. **Verificación de firma**
3. **Auto-creación de contacto** con ID de Facebook
4. **Conversación unificada** por Facebook User ID
5. **Almacenamiento en base de datos**
6. **Detección de tipo** de attachment

### 📊 Información del Contacto
- **ID de Facebook** (identificador único)
- **Nombre** (si está disponible)
- **ID de la página** que recibió el mensaje

---

## 📸 Instagram Messaging

### ✅ Mensajes Entrantes (DMs)
- **Texto**: Mensajes directos
- **Media**: Imágenes, videos, stories compartidas
- **Postbacks**: Respuestas de botones

### 🔄 Procesamiento Automático
1. **Recepción vía webhook**
2. **Verificación de firma**
3. **Auto-creación de contacto** con Instagram ID
4. **Conversación unificada** por Instagram User ID
5. **Almacenamiento en base de datos**

### 📊 Información del Contacto
- **Instagram User ID**
- **Username** (si disponible)

---

## 🎨 Panel de Administración Web

### 📱 Vista Principal (`/messages`)

#### Estadísticas en Tiempo Real
- **Total de mensajes** recibidos
- **Mensajes sin leer** (requieren atención)
- **Tiempo promedio de respuesta** (calculado)
- **Satisfacción del cliente** (basado en respuestas)

#### Filtros
- **Todos**: Muestra mensajes de los 3 canales
- **WhatsApp**: Solo WhatsApp
- **Messenger**: Solo Facebook Messenger
- **Instagram**: Solo Instagram DMs

#### Lista de Conversaciones
- **Ordenada** por mensaje más reciente
- **Muestra**:
  - Icono del canal (WhatsApp/Messenger/Instagram)
  - Nombre del contacto
  - Preview del último mensaje
  - Timestamp relativo ("Hace 5m", "Hace 2h")
  - Indicador de no leído (punto azul)
  - Badge del canal

#### Vista de Conversación
- **Historial completo** de mensajes
- **Burbujas de chat** diferenciadas:
  - Mensajes del cliente: Izquierda, fondo blanco
  - Mensajes del negocio: Derecha, fondo gris oscuro
- **Timestamps** en cada mensaje
- **Scroll automático** al último mensaje
- **Auto-marca como leído** al abrir

#### Input de Respuesta
- Campo de texto para escribir
- Botón de enviar
- **Próximamente**: Envío de imágenes, emojis, plantillas

---

## 🔐 Seguridad

### ✅ Implementado
- **Verificación de firma** (HMAC-SHA256) en todos los webhooks
- **Tokens de verificación** únicos por canal
- **HTTPS obligatorio** (SSL/TLS)
- **Variables de entorno** para secretos
- **Validación de origen** (solo Meta puede llamar webhooks)

### 🔒 Prevención de Duplicados
- **Message ID único** por mensaje
- **Verificación en base de datos** antes de insertar
- **Manejo de reintentos** de Meta

---

## 📊 Base de Datos (Prisma + PostgreSQL)

### Tablas Principales

#### `Contact`
- Información del cliente
- `externalId` + `channel` (índice único)
- `displayName`, `phoneNumber`, `email`
- `metadata` (JSON para datos adicionales)

#### `Conversation`
- Agrupa mensajes por conversación
- `externalConversationId` (único)
- `channel` (WHATSAPP/MESSENGER/INSTAGRAM)
- `lastMessageAt` (para ordenar)
- `unreadCount` (mensajes sin leer)

#### `Message`
- Mensaje individual
- `externalMessageId` (único, evita duplicados)
- `direction` (INBOUND/OUTBOUND)
- `type` (TEXT/IMAGE/VIDEO/AUDIO/DOCUMENT...)
- `status` (PENDING/SENT/DELIVERED/READ/FAILED)
- `textContent`, `metadata` (JSON)
- Timestamps: `sentAt`, `deliveredAt`, `readAt`

#### `Attachment`
- Archivos adjuntos (imágenes, videos, documentos)
- `fileName`, `mimeType`, `fileSize`
- `fileUrl`, `thumbnailUrl`

---

## 🚀 Flujo Completo de un Mensaje

### Cliente → Webhook → Base de Datos → Panel

```
1. Cliente envía WhatsApp: "Hola, quiero info sobre tour San Rafael"
   ↓
2. Meta envía POST a: https://tu-vercel.app/api/webhooks/whatsapp
   {
     "entry": [{
       "changes": [{
         "value": {
           "messages": [{
             "from": "56912345678",
             "text": { "body": "Hola, quiero info..." },
             "timestamp": "1700000000"
           }],
           "contacts": [{
             "profile": { "name": "María González" }
           }]
         }
       }]
     }]
   }
   ↓
3. Webhook verifica firma HMAC-SHA256
   ✓ Firma válida
   ↓
4. Busca/crea Contact:
   - externalId: "56912345678"
   - channel: "WHATSAPP"
   - displayName: "María González"
   ↓
5. Busca/crea Conversation:
   - externalConversationId: "whatsapp_56912345678"
   - contactId: [ID del contact]
   ↓
6. Crea Message:
   - conversationId: [ID de conversation]
   - direction: "INBOUND"
   - type: "TEXT"
   - textContent: "Hola, quiero info..."
   - status: "DELIVERED"
   - sentAt: 2024-11-16 15:30:00
   ↓
7. Actualiza Conversation:
   - lastMessageAt: 2024-11-16 15:30:00
   - unreadCount: +1
   ↓
8. Panel web (/messages) hace fetch a /api/messages
   ↓
9. Ve en la lista: "María González" - "Hace 2m"
   ↓
10. Click en la conversación → fetch /api/conversations/[id]
   ↓
11. Ve el mensaje completo
   ↓
12. Al abrir, auto-marca como leído:
    - readAt: 2024-11-16 15:32:00
    - unreadCount: 0
```

---

## 📈 Próximas Funcionalidades

### En Desarrollo
- [ ] **Enviar mensajes** desde el panel
- [ ] **Plantillas de WhatsApp** pre-aprobadas
- [ ] **Asignación de agentes** a conversaciones
- [ ] **Notificaciones de escritorio** (nuevos mensajes)
- [ ] **Búsqueda** en conversaciones
- [ ] **Etiquetas/Tags** para categorizar
- [ ] **Notas internas** en conversaciones
- [ ] **Estadísticas avanzadas** (gráficos, reportes)
- [ ] **Horarios de atención** y auto-respuestas
- [ ] **Integraciones**: Zapier, Make, n8n

### Futuras
- [ ] **WhatsApp Flows** (formularios interactivos)
- [ ] **Catálogos de productos** (WhatsApp Business)
- [ ] **Pagos** vía WhatsApp Pay
- [ ] **Multi-agente** con chat interno
- [ ] **IA/ChatGPT** para respuestas automáticas
- [ ] **CRM integrado** con clientes

---

## 💰 Costos Operacionales

### Servicios Gratuitos
- ✅ **Vercel**: Hobby Plan (gratis)
- ✅ **Neon**: 0.5GB gratis
- ✅ **Messenger**: Ilimitado gratis
- ✅ **Instagram**: Ilimitado gratis

### WhatsApp Business API
- **Primeras 1,000 conversaciones/mes**: GRATIS
- **Después**: ~$0.005 - $0.02 USD por conversación
- **Conversación**: Ventana de 24 horas desde el último mensaje del cliente

**Ejemplo de costos**:
- 500 conversaciones/mes: **$0** (gratis)
- 2,000 conversaciones/mes: **~$5-10 USD**
- 5,000 conversaciones/mes: **~$20-50 USD**

---

## 📞 Soporte Técnico

Si algo no funciona:

1. **Ver logs de Vercel**: `vercel logs --follow`
2. **Ver base de datos**: `npx prisma studio`
3. **Ver webhooks en Meta**: App Dashboard → Webhooks
4. **Revisar documentación**: `SETUP.md` y `DEPLOY.md`

---

## 🎉 Resumen

Con este sistema tendrás:
- ✅ **Mensajería unificada** de 3 canales en un solo lugar
- ✅ **Tiempo real** - Los mensajes llegan instantáneamente
- ✅ **Escalable** - Soporta miles de conversaciones
- ✅ **Profesional** - Diseño limpio y moderno
- ✅ **Seguro** - Verificación de firmas y HTTPS
- ✅ **Económico** - Hasta 1,000 conversaciones gratis/mes
- ✅ **24/7** - Funciona sin tu computador encendida
