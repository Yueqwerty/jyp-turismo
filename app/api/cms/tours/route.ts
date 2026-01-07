import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { tourSchema, toursSectionSchema, validateInput } from '@/lib/validations/cms';

// POST - Create new tour
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateInput(tourSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get or create active tours section
    let toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });
    if (!toursSection) {
      toursSection = await prisma.toursSection.create({ data: {} });
    }

    const { id, ...tourData } = validation.data;

    const tour = await prisma.tour.create({
      data: {
        ...tourData,
        toursSectionId: toursSection.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('[Tours POST] Error:', error);
    return NextResponse.json(
      { error: 'Error al crear tour' },
      { status: 500 }
    );
  }
}

// PUT - Update tours section
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateInput(toursSectionSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });

    if (toursSection) {
      toursSection = await prisma.toursSection.update({
        where: { id: toursSection.id },
        data: {
          sectionTitle: validation.data.sectionTitle,
          sectionDescription: validation.data.sectionDescription,
        },
      });
    } else {
      toursSection = await prisma.toursSection.create({
        data: validation.data,
      });
    }

    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json(toursSection);
  } catch (error) {
    console.error('[Tours PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar seccion de tours' },
      { status: 500 }
    );
  }
}
