import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const prisma = new PrismaClient();

/**
 * Endpoint especial para actualizar información de contacto
 * Solo accesible para usuarios autenticados
 */
export async function POST() {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const updates = {
      whatsappNumber: '56997187142',
      phone: '+56 9 9718 7142',
      facebookUrl: 'https://www.facebook.com/p/JP-Turismo-LTDA-100094369012030/',
      instagramUrl: 'https://www.instagram.com/jypturismo/',
      email: 'jypturismoltda@gmail.com',
    };

    // Actualizar Hero Section
    const heroSection = await prisma.heroSection.findFirst({ where: { isActive: true } });
    let heroResult = null;

    if (heroSection) {
      heroResult = await prisma.heroSection.update({
        where: { id: heroSection.id },
        data: {
          whatsappNumber: updates.whatsappNumber,
          facebookUrl: updates.facebookUrl,
          instagramUrl: updates.instagramUrl,
          email: updates.email,
          ctaPhoneText: updates.phone,
          ctaWhatsappText: 'WhatsApp',
        },
      });
    }

    // Actualizar Site Settings
    const siteSettings = await prisma.siteSettings.findFirst();
    let settingsResult = null;

    if (siteSettings) {
      settingsResult = await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: {
          phone: updates.phone,
          whatsappNumber: updates.whatsappNumber,
          facebookUrl: updates.facebookUrl,
          instagramUrl: updates.instagramUrl,
          email: updates.email,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Información de contacto actualizada exitosamente',
      updates: {
        heroSection: heroResult ? 'Actualizado' : 'No encontrado',
        siteSettings: settingsResult ? 'Actualizado' : 'No encontrado',
        data: updates,
      },
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json(
      {
        error: 'Error al actualizar información de contacto',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
