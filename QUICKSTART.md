# 🚀 Inicio Rápido - J&P Turismo CMS

Esta guía te ayudará a poner en marcha el sistema en **menos de 5 minutos**.

## ✅ Pre-requisitos

Tu proyecto ya tiene configurado:
- ✅ Base de datos Neon PostgreSQL
- ✅ Variables de entorno (`.env`)
- ✅ Dependencias instaladas

## 📋 Pasos de Configuración

### 1. Sincronizar Base de Datos

Ejecuta este comando para crear todas las tablas en tu base de datos Neon:

```bash
npx prisma db push
```

Deberías ver un mensaje como:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

### 2. Generar Cliente Prisma

```bash
npx prisma generate
```

### 3. Crear Usuario Administrador

Ejecuta el script interactivo:

```bash
npm run create-admin
```

Te pedirá:
```
Email: admin@jyp-turismo.com
Nombre: Administrador
Contraseña: ********
```

> **Nota**: Guarda estas credenciales en un lugar seguro, las necesitarás para acceder al panel de administración.

### 4. Iniciar el Servidor

```bash
npm run dev
```

## 🎉 ¡Listo!

Tu aplicación estará corriendo en:

- **Sitio web**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Panel Admin**: http://localhost:3000/admin

## 🔐 Iniciar Sesión

1. Ve a http://localhost:3000/login
2. Ingresa el email y contraseña que creaste
3. Serás redirigido al panel de administración

## 🎨 Editar Contenido

Desde el panel de administración (`/admin`) puedes editar:

### Hero Section
- Tagline, títulos y descripción
- Cards de información
- Imagen principal
- Botones de contacto (WhatsApp y teléfono)

### Tours (Bento Grid)
- Crear, editar y eliminar tours
- Subir imágenes para cada tour
- Agregar tags personalizados
- Marcar tours como "destacados"
- Reorganizar el orden

### Configuración del Sitio
- Nombre de la empresa
- Logo
- Meta tags (SEO)
- Email y teléfono
- WhatsApp
- Redes sociales

### Footer
- Descripción de la empresa
- Información de contacto
- Newsletter (activar/desactivar)
- Copyright

## 🔧 Comandos Útiles

```bash
# Ver la base de datos visualmente
npx prisma studio

# Verificar conexión a la base de datos
npx prisma db execute --stdin <<< "SELECT version();"

# Limpiar y reconstruir
npm run build

# Ver logs en desarrollo
npm run dev --turbo
```

## ⚠️ Solución de Problemas

### Error: No se puede conectar a la base de datos

Verifica que tu archivo `.env` tenga la variable `DATABASE_URL` correcta:

```env
DATABASE_URL="postgresql://neondb_owner:...@ep-rough-night-ahn0t929-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Error: Prisma Client no generado

Ejecuta:
```bash
npx prisma generate
```

### La página no carga el contenido

1. Verifica que hayas ejecutado `npx prisma db push`
2. Revisa la consola del servidor para ver errores
3. Si la base de datos está vacía, la página mostrará contenido por defecto (esto es normal)

### No puedo iniciar sesión

1. Verifica que hayas creado un usuario con `npm run create-admin`
2. Revisa que el email y contraseña sean correctos
3. Verifica que `NEXTAUTH_SECRET` esté configurado en `.env`

## 📱 Próximos Pasos

1. **Personaliza el contenido** desde el panel admin
2. **Sube imágenes de los tours** a `/public/images/tours/`
3. **Configura los meta tags** para SEO
4. **Prueba el sitio** en diferentes dispositivos
5. **Despliega a producción** en Vercel

## 🌐 Deployment a Vercel

Cuando estés listo para publicar:

1. Push a GitHub:
   ```bash
   git add .
   git commit -m "Configuración inicial CMS"
   git push origin claude/check-status-011hRCFpgTfcmZzQ7LQhq93d
   ```

2. Conecta en Vercel:
   - Importa el repositorio
   - Agrega las variables de entorno (.env)
   - Deploy

3. Ejecuta migraciones en producción:
   ```bash
   npx prisma db push
   ```

4. Crea usuario admin en producción:
   ```bash
   npm run create-admin
   ```

## 📚 Más Información

- **README.md** - Documentación completa
- **prisma/schema.prisma** - Schema de base de datos
- **app/api/cms/** - Documentación de APIs

## 💡 Tips

- Usa **Prisma Studio** (`npx prisma studio`) para explorar y editar datos directamente
- El sitio funciona sin base de datos (muestra contenido por defecto)
- Las imágenes se guardan en `/public/images/tours/`
- Todos los cambios en el CMS se reflejan instantáneamente

---

**¿Problemas?** Revisa los logs de la consola o consulta el README.md completo.
