/**
 * Script para crear usuario administrador inicial
 * Uso: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const prisma = new PrismaClient();

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(prompt, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n=== Crear Usuario Administrador ===\n');

    const email = await question('Email: ');
    const name = await question('Nombre: ');
    const password = await question('Contraseña: ');

    if (!email || !password) {
      console.error('Email y contraseña son requeridos');
      process.exit(1);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`\nError: Ya existe un usuario con el email ${email}`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('\n✓ Usuario administrador creado exitosamente\n');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Nombre: ${user.name}`);
    console.log(`Rol: ${user.role}`);
    console.log(`\nPuedes iniciar sesión en http://localhost:3000/login\n`);
  } catch (error) {
    console.error('Error creando usuario:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    readline.close();
  }
}

createAdmin();
