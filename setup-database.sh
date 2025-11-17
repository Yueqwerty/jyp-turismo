#!/bin/bash

echo "🚀 Configurando base de datos J&P Turismo..."
echo ""

# Verificar que existe .env
if [ ! -f .env ]; then
    echo "❌ Error: No se encuentra el archivo .env"
    echo "Por favor crea el archivo .env con tu DATABASE_URL de Neon"
    exit 1
fi

# Generar cliente Prisma
echo "📦 Generando cliente Prisma..."
npx prisma generate

# Aplicar migraciones
echo "🔄 Aplicando migraciones a la base de datos..."
npx prisma db push

# Verificar conexión
echo "✅ Verificando conexión a la base de datos..."
npx prisma db execute --stdin <<SQL
SELECT 'Database connected successfully!' as status;
SQL

echo ""
echo "✅ ¡Base de datos configurada correctamente!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Crea un usuario administrador ejecutando: npm run create-admin"
echo "2. Inicia el servidor de desarrollo: npm run dev"
echo "3. Accede al panel de administración en: http://localhost:3000/admin"
echo ""
