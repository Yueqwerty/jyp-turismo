import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const prisma = new PrismaClient();

/**
 * Endpoint para sincronizar todos los tours desde los datos por defecto
 */
export async function POST() {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener la sección de tours activa
    const toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });

    if (!toursSection) {
      return NextResponse.json({ error: 'No hay sección de tours activa' }, { status: 404 });
    }

    // Verificar cuántos tours existen
    const existingTours = await prisma.tour.findMany({
      where: { toursSectionId: toursSection.id }
    });

    console.log(`📊 Tours existentes: ${existingTours.length}`);

    // Si hay menos de 7 tours, agregar los que faltan
    const allTours = [
      {
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
    ];

    const toursToAdd = [];

    for (const tourData of allTours) {
      const exists = existingTours.find(t => t.title === tourData.title);
      if (!exists) {
        toursToAdd.push({
          ...tourData,
          toursSectionId: toursSection.id,
        });
      }
    }

    if (toursToAdd.length > 0) {
      await prisma.tour.createMany({ data: toursToAdd });
      console.log(`✅ Agregados ${toursToAdd.length} tours nuevos`);
    }

    // Obtener todos los tours actualizados
    const updatedTours = await prisma.tour.findMany({
      where: { toursSectionId: toursSection.id, isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      message: `Sincronización completada. Total de tours: ${updatedTours.length}`,
      toursAdded: toursToAdd.length,
      totalTours: updatedTours.length,
      tours: updatedTours.map(t => ({ id: t.id, title: t.title, order: t.order })),
    });
  } catch (error) {
    console.error('Error syncing tours:', error);
    return NextResponse.json(
      { error: 'Error al sincronizar tours', details: error },
      { status: 500 }
    );
  }
}
