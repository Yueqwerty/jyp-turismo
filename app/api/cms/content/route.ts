import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todo el contenido del sitio
export async function GET() {
  try {
    // Obtener o crear configuraciones predeterminadas
    let siteSettings = await prisma.siteSettings.findFirst();
    if (!siteSettings) {
      siteSettings = await prisma.siteSettings.create({ data: {} });
    }

    let heroSection = await prisma.heroSection.findFirst({ where: { isActive: true } });
    if (!heroSection) {
      heroSection = await prisma.heroSection.create({ data: {} });
    }

    let toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });
    if (!toursSection) {
      toursSection = await prisma.toursSection.create({ data: {} });
    }

    const tours = await prisma.tour.findMany({
      where: {
        toursSectionId: toursSection.id,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });
    if (!footerSettings) {
      footerSettings = await prisma.footerSettings.create({ data: {} });
    }

    let toursPage = await prisma.toursPage.findFirst({ where: { isActive: true } });
    if (!toursPage) {
      toursPage = await prisma.toursPage.create({ data: {} });
    }

    return NextResponse.json({
      siteSettings,
      heroSection,
      toursSection,
      tours,
      footerSettings,
      toursPage,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}
