import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// POST - Crear nuevo tour
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    // Obtener la sección de tours activa
    let toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });
    if (!toursSection) {
      toursSection = await prisma.toursSection.create({ data: {} });
    }

    const tour = await prisma.tour.create({
      data: {
        ...data,
        toursSectionId: toursSection.id,
      },
    });

    // Revalidar la página principal y el catálogo para mostrar el nuevo tour
    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Error al crear tour' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar tours section
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    let toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });

    if (toursSection) {
      toursSection = await prisma.toursSection.update({
        where: { id: toursSection.id },
        data: {
          sectionTitle: data.sectionTitle,
          sectionDescription: data.sectionDescription,
        },
      });
    } else {
      toursSection = await prisma.toursSection.create({ data });
    }

    // Revalidar la página principal y el catálogo para mostrar los cambios
    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json(toursSection);
  } catch (error) {
    console.error('Error updating tours section:', error);
    return NextResponse.json(
      { error: 'Error al actualizar sección de tours' },
      { status: 500 }
    );
  }
}
