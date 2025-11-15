# JYP Turismo - Central de Mensajería Unificada

Plataforma profesional para centralizar mensajes de WhatsApp Business, Facebook Messenger e Instagram en una sola interfaz desarrollada con C# Blazor Server.

## Características Principales

- **Centralización Total**: Gestiona mensajes de WhatsApp Business, Messenger e Instagram desde una única plataforma
- **Tiempo Real**: Actualizaciones instantáneas con SignalR
- **Arquitectura Profesional**: Diseño en capas con separación de responsabilidades
- **Seguridad Avanzada**: Verificación de firmas de webhooks y cifrado de datos
- **Escalable**: Preparado para crecer con tu negocio
- **API Oficial de Meta**: Integración directa con las APIs oficiales

## Tecnologías Utilizadas

- **Backend**: C# .NET 8.0
- **Framework**: Blazor Server
- **ORM**: Entity Framework Core 8.0
- **Base de Datos**: SQL Server
- **Tiempo Real**: SignalR
- **APIs**: Meta Graph API (WhatsApp, Messenger, Instagram)

## Arquitectura del Proyecto

```
JypTurismo/
├── src/
│   ├── JypTurismo.Core/           # Entidades y contratos
│   │   ├── Entities/              # Entidades de dominio
│   │   ├── Enums/                 # Enumeraciones
│   │   └── Interfaces/            # Interfaces de servicios
│   │
│   ├── JypTurismo.Application/    # Lógica de negocio
│   │
│   ├── JypTurismo.Infrastructure/ # Implementaciones
│   │   ├── Data/                  # DbContext y configuraciones
│   │   ├── Repositories/          # Repositorios y UnitOfWork
│   │   └── Services/              # Servicios de integración
│   │
│   └── JypTurismo.Web/            # Capa de presentación
│       ├── Controllers/           # Controladores de API
│       ├── Hubs/                  # SignalR Hubs
│       ├── Pages/                 # Páginas Blazor
│       └── Components/            # Componentes reutilizables
```

## Requisitos Previos

- .NET 8.0 SDK
- SQL Server (LocalDB o versión completa)
- Visual Studio 2022 o Rider (opcional)
- Cuenta de Meta Business con acceso a las APIs

## Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Yueqwerty/jyp-turismo.git
cd jyp-turismo
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Meta:

- **WhatsApp Business**: Obtén tokens desde Meta Business Manager
- **Messenger**: Configura una aplicación de Facebook
- **Instagram**: Vincula tu cuenta de Instagram Business

### 3. Configurar Base de Datos

Actualiza la cadena de conexión en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=JypTurismoDb;Trusted_Connection=True"
  }
}
```

### 4. Aplicar Migraciones

```bash
cd src/JypTurismo.Web
dotnet ef database update --project ../JypTurismo.Infrastructure
```

### 5. Ejecutar la Aplicación

```bash
dotnet run
```

La aplicación estará disponible en `https://localhost:5001`

## Configuración de Webhooks

### WhatsApp Business

1. Accede a Meta Business Manager
2. Configura el webhook en tu aplicación de WhatsApp
3. URL del webhook: `https://tudominio.com/api/webhooks/whatsapp`
4. Eventos a suscribirse: `messages`

### Messenger

1. Crea una aplicación de Facebook
2. Configura el webhook
3. URL del webhook: `https://tudominio.com/api/webhooks/messenger`
4. Eventos: `messages`, `messaging_postbacks`

### Instagram

1. Vincula tu cuenta de Instagram Business
2. Configura el webhook
3. URL del webhook: `https://tudominio.com/api/webhooks/instagram`
4. Eventos: `messages`, `messaging_postbacks`

## Estructura de la Base de Datos

### Entidades Principales

- **Message**: Mensajes centralizados de todos los canales
- **Conversation**: Hilos de conversación
- **Contact**: Contactos de clientes
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
- Sanitización de entrada de datos
- Protección contra inyección SQL mediante Entity Framework Core

## Mejores Prácticas Implementadas

### Código

- Documentación XML completa
- Arquitectura en capas (Clean Architecture)
- Patrón Repository y Unit of Work
- Inyección de dependencias
- Logging estructurado
- Manejo de errores centralizado

### Performance

- Conexión a base de datos con retry automático
- Compresión de respuestas HTTP
- SignalR con reconexión automática
- Lazy loading de datos

## Desarrollo

### Agregar Nuevas Migraciones

```bash
cd src/JypTurismo.Infrastructure
dotnet ef migrations add NombreMigracion --startup-project ../JypTurismo.Web
```

### Ejecutar Tests

```bash
dotnet test
```

## Despliegue

### Azure App Service

1. Publica la aplicación desde Visual Studio o CLI
2. Configura las variables de entorno en Azure
3. Configura la cadena de conexión a SQL Azure
4. Habilita HTTPS y dominios personalizados

### Docker

```bash
docker build -t jypturismo .
docker run -p 5000:80 jypturismo
```

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
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
- [ ] Aplicación móvil
- [ ] Sistema de etiquetas y categorías
- [ ] Plantillas de mensajes
- [ ] Asignación de agentes
- [ ] Horarios de atención

---

Desarrollado con profesionalismo por el equipo de JYP Turismo