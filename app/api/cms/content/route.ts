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

    // Retornar datos fallback cuando la base de datos no está disponible
    return NextResponse.json({
      siteSettings: {
        id: 'fallback',
        logoText: 'J&P',
        companyName: 'J&P Turismo',
        metaTitle: 'J&P Turismo - Explora la Patagonia Aysén',
        metaDescription: 'Transporte y turismo en la Carretera Austral. Conectamos Coyhaique con Laguna San Rafael, Capillas de Mármol y todo el Campo de Hielo Norte.',
        phone: '+56 9 XXXX XXXX',
        whatsappNumber: '56912345678',
        email: 'contacto@jypturismo.cl',
        facebookUrl: null,
        instagramUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      heroSection: {
        id: 'fallback',
        tagline: 'Transporte · Patagonia Aysén',
        titleLine1: 'Explora',
        titleLine2: 'Aysén',
        description: 'Conectamos Coyhaique con los glaciares del Campo de Hielo Norte, las Capillas de Mármol y toda la Carretera Austral.',
        whatsappNumber: '56912345678',
        facebookUrl: null,
        instagramUrl: null,
        email: 'contacto@jypturismo.cl',
        heroImage: '/images/tours/laguna-san-rafael.jpg',
        heroImageAlt: 'Glaciar San Rafael',
        heroBadgeText: 'Campo de Hielo Norte',
        ctaWhatsappText: 'WhatsApp',
        ctaPhoneText: '+56 9 XXXX XXXX',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      toursSection: {
        id: 'fallback',
        sectionTitle: 'Rutas & Experiencias',
        sectionDescription: 'Desde Coyhaique hacia los destinos más icónicos de la Patagonia',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      tours: [
        {
          id: 'fallback-1',
          toursSectionId: 'fallback',
          title: 'Laguna San Rafael',
          description: 'Navegación hacia el glaciar más accesible del Campo de Hielo Norte.',
          tags: ['Día completo', 'Navegación', '380 km'],
          image: '/images/tours/laguna-san-rafael.jpg',
          gradient: 'from-cyan-600 to-teal-600',
          colSpan: 7,
          rowSpan: 2,
          minHeight: '600px',
          featured: true,
          order: 1,
          packageName: null,
          packagePrice: null,
          packageDuration: null,
          packageIncludes: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'fallback-2',
          toursSectionId: 'fallback',
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
          packageName: null,
          packagePrice: null,
          packageDuration: null,
          packageIncludes: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'fallback-3',
          toursSectionId: 'fallback',
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
          packageName: null,
          packagePrice: null,
          packageDuration: null,
          packageIncludes: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      footerSettings: {
        id: 'fallback',
        brandTitle: 'J&P Turismo',
        brandDescription: 'Transporte y turismo en la Patagonia Aysén desde 2010. Conectamos personas con los paisajes más remotos del sur de Chile.',
        copyrightText: '© 2024 J&P Turismo. Región de Aysén, Chile.',
        newsletterEnabled: false,
        newsletterTitle: 'Newsletter',
        newsletterPlaceholder: 'tu@email.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
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
