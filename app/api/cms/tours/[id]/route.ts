import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// PUT - Actualizar un tour específico
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { id } = params;

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        tags: data.tags,
        image: data.image,
        gradient: data.gradient,
        colSpan: data.colSpan,
        rowSpan: data.rowSpan,
        minHeight: data.minHeight,
        featured: data.featured,
        order: data.order,
        packageName: data.packageName,
        packageDescription: data.packageDescription,
        packagePrice: data.packagePrice,
        packageDuration: data.packageDuration,
        packageIncludes: data.packageIncludes,
      },
    });

    // Revalidar la página principal para mostrar los cambios
    revalidatePath('/');

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Error al actualizar tour' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un tour
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;

    await prisma.tour.delete({ where: { id } });

    // Revalidar la página principal para reflejar la eliminación
    revalidatePath('/');

    return NextResponse.json({ message: 'Tour eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tour' },
      { status: 500 }
    );
  }
}
