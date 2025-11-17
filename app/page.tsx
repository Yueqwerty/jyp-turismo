import { PrismaClient } from '@prisma/client';
import HomeClient from './home-client';

const prisma = new PrismaClient();

async function getContent() {
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

    let tours = await prisma.tour.findMany({
      where: {
        toursSectionId: toursSection.id,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    // Si no hay tours, crear los predeterminados
    if (tours.length === 0) {
      await createDefaultTours(toursSection.id);
      tours = await prisma.tour.findMany({
        where: { toursSectionId: toursSection.id, isActive: true },
        orderBy: { order: 'asc' },
      });
    }

    let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });
    if (!footerSettings) {
      footerSettings = await prisma.footerSettings.create({ data: {} });
    }

    // Map tours to match the client interface
    const mappedTours = tours.map(tour => ({
      id: tour.id,
      title: tour.title,
      description: tour.description,
      tags: tour.tags,
      image: tour.image,
      gradient: tour.gradient,
      colSpan: tour.colSpan,
      rowSpan: tour.rowSpan,
      minHeight: tour.minHeight,
      featured: tour.featured,
      order: tour.order,
    }));

    return {
      siteSettings,
      heroSection,
      toursSection,
      tours: mappedTours,
      footerSettings,
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    // Return default fallback data
    return null;
  }
}

async function createDefaultTours(toursSectionId: string) {
  const defaultTours = [
    {
      toursSectionId,
      title: 'Laguna San Rafael',
      description:
        'Navegación hacia el glaciar más accesible del Campo de Hielo Norte. 3 horas desde Puerto Chacabuco.',
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

export default async function HomePage() {
  const content = await getContent();

  if (!content) {
    return <div>Error loading content</div>;
  }

  return (
    <HomeClient
      heroSection={content.heroSection}
      toursSection={content.toursSection}
      tours={content.tours}
      footerSettings={content.footerSettings}
      siteSettings={content.siteSettings}
    />
  );
}
