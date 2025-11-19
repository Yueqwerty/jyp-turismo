import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// GET - Obtener ToursPage
export async function GET() {
  try {
    let toursPage = await prisma.toursPage.findFirst({ where: { isActive: true } });

    if (!toursPage) {
      toursPage = await prisma.toursPage.create({ data: {} });
    }

    return NextResponse.json(toursPage);
  } catch (error) {
    console.error('Error fetching tours page:', error);
    return NextResponse.json(
      { error: 'Error al obtener página de tours' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar ToursPage
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    let toursPage = await prisma.toursPage.findFirst({ where: { isActive: true } });

    if (toursPage) {
      toursPage = await prisma.toursPage.update({
        where: { id: toursPage.id },
        data: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
        },
      });
    } else {
      toursPage = await prisma.toursPage.create({ data });
    }

    // Revalidar la página de tours
    revalidatePath('/tours');

    return NextResponse.json(toursPage);
  } catch (error) {
    console.error('Error updating tours page:', error);
    return NextResponse.json(
      { error: 'Error al actualizar página de tours' },
      { status: 500 }
    );
  }
}
