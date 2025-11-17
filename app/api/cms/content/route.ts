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

    // Si no hay tours, crear los predeterminados
    if (tours.length === 0) {
      await createDefaultTours(toursSection.id);
      const newTours = await prisma.tour.findMany({
        where: { toursSectionId: toursSection.id, isActive: true },
        orderBy: { order: 'asc' },
      });

      let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });
      if (!footerSettings) {
        footerSettings = await prisma.footerSettings.create({ data: {} });
      }

      return NextResponse.json({
        siteSettings,
        heroSection,
        toursSection,
        tours: newTours,
        footerSettings,
      });
    }

    let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });
    if (!footerSettings) {
      footerSettings = await prisma.footerSettings.create({ data: {} });
    }

    return NextResponse.json({
      siteSettings,
      heroSection,
      toursSection,
      tours,
      footerSettings,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Error al obtener el contenido' },
      { status: 500 }
    );
  }
}

// Función auxiliar para crear tours predeterminados
async function createDefaultTours(toursSectionId: string) {
  const defaultTours = [
    {
      toursSectionId,
      title: 'Laguna San Rafael',
      description: 'Navegación hacia el glaciar más accesible del Campo de Hielo Norte. 3 horas desde Puerto Chacabuco.',
      tags: ['Día completo', 'Navegación', '380 km'],
      image: '/images/tours/laguna-san-rafael.jpg',
      gradient: 'from-blue-600 to-blue-700',
      colSpan: 7,
      rowSpan: 2,
      minHeight: '600px',
      featured: true,
      order: 1,
    },
    {
      toursSectionId,
      title: 'Capillas de Mármol',
      tags: ['Puerto Tranquilo', '45 min'],
      image: '/images/tours/capillas-marmol.jpg',
      gradient: 'from-gray-700 to-gray-800',
      colSpan: 5,
      rowSpan: 1,
      minHeight: '290px',
      order: 2,
    },
    {
      toursSectionId,
      title: 'Parque Queulat',
      tags: ['Ventisquero Colgante', '2.5 hrs'],
      image: '/images/tours/queulat.jpg',
      gradient: 'from-gray-600 to-gray-700',
      colSpan: 5,
      rowSpan: 1,
      minHeight: '290px',
      order: 3,
    },
    {
      toursSectionId,
      title: 'Ensenada Pérez',
      tags: ['Fiordos'],
      image: '/images/tours/ensenada-perez.jpg',
      gradient: 'from-gray-800 to-gray-900',
      colSpan: 5,
      rowSpan: 1,
      minHeight: '360px',
      order: 4,
    },
    {
      toursSectionId,
      title: 'Carretera Austral',
      tags: ['Multi-día'],
      image: '/images/tours/carretera-austral.jpg',
      gradient: 'from-blue-700 to-blue-800',
      colSpan: 7,
      rowSpan: 1,
      minHeight: '360px',
      order: 5,
    },
    {
      toursSectionId,
      title: 'Ventisqueros',
      tags: ['Trekking'],
      image: '/images/tours/ventisqueros.jpg',
      gradient: 'from-gray-700 to-gray-900',
      colSpan: 4,
      rowSpan: 1,
      minHeight: '320px',
      order: 6,
    },
    {
      toursSectionId,
      title: 'Pesca Deportiva',
      tags: ['Medio día'],
      image: '/images/tours/pesca-deportiva.jpg',
      gradient: 'from-blue-800 to-blue-900',
      colSpan: 8,
      rowSpan: 1,
      minHeight: '320px',
      order: 7,
    },
  ];

  await prisma.tour.createMany({ data: defaultTours });
}
