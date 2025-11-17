import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// PUT - Actualizar Hero Section
export async function PUT(request: Request) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Buscar la hero section activa
    let heroSection = await prisma.heroSection.findFirst({ where: { isActive: true } });

    if (heroSection) {
      // Actualizar existente
      heroSection = await prisma.heroSection.update({
        where: { id: heroSection.id },
        data: {
          tagline: data.tagline,
          titleLine1: data.titleLine1,
          titleLine2: data.titleLine2,
          description: data.description,
          infoCard1Title: data.infoCard1Title,
          infoCard1Subtitle: data.infoCard1Subtitle,
          infoCard2Title: data.infoCard2Title,
          infoCard2Subtitle: data.infoCard2Subtitle,
          heroImage: data.heroImage,
          heroImageAlt: data.heroImageAlt,
          heroBadgeText: data.heroBadgeText,
          ctaWhatsappText: data.ctaWhatsappText,
          ctaPhoneText: data.ctaPhoneText,
        },
      });
    } else {
      // Crear nuevo
      heroSection = await prisma.heroSection.create({ data });
    }

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { error: 'Error al actualizar hero section' },
      { status: 500 }
    );
  }
}
