import { PrismaClient } from '@prisma/client';
import HomeClient from './home-client';

const prisma = new PrismaClient();

// Desactivar cache para siempre obtener datos frescos de la BD
export const revalidate = 0;

function getDefaultContent() {
  return {
    siteSettings: {
      logoText: 'J&P',
      companyName: 'J&P Turismo',
      phone: '+56 9 9718 7142',
      whatsappNumber: '56997187142',
      email: 'jypturismoltda@gmail.com',
      facebookUrl: 'https://www.facebook.com/p/JP-Turismo-LTDA-100094369012030/',
      instagramUrl: 'https://www.instagram.com/jypturismo/',
    },
    heroSection: {
      tagline: 'Transporte · Patagonia Aysén',
      titleLine1: 'Explora',
      titleLine2: 'Aysén',
      description: 'Conectamos Coyhaique con los glaciares del Campo de Hielo Norte, las Capillas de Mármol y toda la Carretera Austral.',
      whatsappNumber: '56997187142',
      facebookUrl: 'https://www.facebook.com/p/JP-Turismo-LTDA-100094369012030/',
      instagramUrl: 'https://www.instagram.com/jypturismo/',
      email: 'jypturismoltda@gmail.com',
      heroImage: '/images/tours/laguna-san-rafael.jpg',
      heroImageAlt: 'Glaciar San Rafael',
      heroBadgeText: 'Campo de Hielo Norte',
      ctaWhatsappText: 'WhatsApp',
      ctaPhoneText: '+56 9 9718 7142',
    },
    toursSection: {
      sectionTitle: 'Rutas',
      sectionDescription: 'Desde Puerto Tranquilo hasta el Parque Queulat. Descubre glaciares milenarios, formaciones de mármol y bosques nativos.',
    },
    tours: [
      {
        id: '1',
        title: 'Laguna San Rafael',
        description: 'Navegación hacia el glaciar más accesible del Campo de Hielo Norte. 3 horas desde Puerto Chacabuco.',
        tags: ['Día completo', 'Navegación', '380 km'],
        image: '/images/tours/laguna-san-rafael.jpg',
        gradient: 'from-cyan-600 to-teal-600',
        colSpan: 7,
        rowSpan: 2,
        minHeight: '600px',
        featured: true,
        order: 1,
      },
      {
        id: '2',
        title: 'Capillas de Mármol',
        description: null,
        tags: ['Puerto Tranquilo', '45 min'],
        image: '/images/tours/capillas-marmol.jpg',
        gradient: 'from-gray-700 to-gray-800',
        colSpan: 5,
        rowSpan: 1,
        minHeight: '290px',
        featured: false,
        order: 2,
      },
      {
        id: '3',
        title: 'Parque Queulat',
        description: null,
        tags: ['Ventisquero Colgante', '2.5 hrs'],
        image: '/images/tours/queulat.jpg',
        gradient: 'from-gray-600 to-gray-700',
        colSpan: 5,
        rowSpan: 1,
        minHeight: '290px',
        featured: false,
        order: 3,
      },
      {
        id: '4',
        title: 'Ensenada Pérez',
        description: null,
        tags: ['Fiordos'],
        image: '/images/tours/ensenada-perez.jpg',
        gradient: 'from-gray-800 to-gray-900',
        colSpan: 5,
        rowSpan: 1,
        minHeight: '360px',
        featured: false,
        order: 4,
      },
      {
        id: '5',
        title: 'Carretera Austral',
        description: null,
        tags: ['Multi-día'],
        image: '/images/tours/carretera-austral.jpg',
        gradient: 'from-cyan-700 to-teal-700',
        colSpan: 7,
        rowSpan: 1,
        minHeight: '360px',
        featured: false,
        order: 5,
      },
      {
        id: '6',
        title: 'Ventisqueros',
        description: null,
        tags: ['Trekking'],
        image: '/images/tours/ventisqueros.jpg',
        gradient: 'from-gray-700 to-gray-900',
        colSpan: 4,
        rowSpan: 1,
        minHeight: '320px',
        featured: false,
        order: 6,
      },
      {
        id: '7',
        title: 'Pesca Deportiva',
        description: null,
        tags: ['Medio día'],
        image: '/images/tours/pesca-deportiva.jpg',
        gradient: 'from-cyan-800 to-teal-800',
        colSpan: 8,
        rowSpan: 1,
        minHeight: '320px',
        featured: false,
        order: 7,
      },
    ],
    footerSettings: {
      brandTitle: 'J&P\nTurismo',
      brandDescription: 'Transporte especializado desde Coyhaique hacia los destinos más icónicos de la Patagonia chilena.',
      copyrightText: 'J&P Turismo · Región de Aysén, Chile',
      newsletterEnabled: true,
      newsletterTitle: 'Newsletter',
      newsletterPlaceholder: 'Tu email',
    },
  };
}

async function getContent() {
  try {
    // Verificar si existe DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  No DATABASE_URL configured, using default content');
      return getDefaultContent();
    }

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
      packageName: tour.packageName,
      packagePrice: tour.packagePrice,
      packageDuration: tour.packageDuration,
      packageIncludes: tour.packageIncludes,
    }));

    return {
      siteSettings,
      heroSection,
      toursSection,
      tours: mappedTours,
      footerSettings,
    };
  } catch (error) {
    console.error('Error fetching content from database:', error);
    console.log('⚠️  Falling back to default content');
    return getDefaultContent();
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
      gradient: 'from-cyan-600 to-teal-600',
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
      gradient: 'from-cyan-700 to-teal-700',
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
      gradient: 'from-cyan-800 to-teal-800',
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
