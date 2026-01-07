import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { tourSchema, validateInput } from '@/lib/validations/cms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single tour
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const tour = await prisma.tour.findUnique({
      where: { id },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('[Tour GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener tour' },
      { status: 500 }
    );
  }
}

// PUT - Update tour
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = validateInput(tourSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Verify tour exists
    const existingTour = await prisma.tour.findUnique({ where: { id } });
    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour no encontrado' },
        { status: 404 }
      );
    }

    const { id: _, ...tourData } = validation.data;

    const tour = await prisma.tour.update({
      where: { id },
      data: tourData,
    });

    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json(tour);
  } catch (error) {
    console.error('[Tour PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar tour' },
      { status: 500 }
    );
  }
}

// DELETE - Delete tour
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Verify tour exists
    const existingTour = await prisma.tour.findUnique({ where: { id } });
    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour no encontrado' },
        { status: 404 }
      );
    }

    await prisma.tour.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/tours');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Tour DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tour' },
      { status: 500 }
    );
  }
}
