import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { toursPageSchema, validateInput } from '@/lib/validations/cms';

// GET - Get tours page config
export async function GET() {
  try {
    let toursPage = await prisma.toursPage.findFirst({ where: { isActive: true } });

    if (!toursPage) {
      toursPage = await prisma.toursPage.create({ data: {} });
    }

    return NextResponse.json(toursPage);
  } catch (error) {
    console.error('[ToursPage GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener pagina de tours' },
      { status: 500 }
    );
  }
}

// PUT - Update tours page config
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateInput(toursPageSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let toursPage = await prisma.toursPage.findFirst({ where: { isActive: true } });

    const { id, ...pageData } = validation.data;

    if (toursPage) {
      toursPage = await prisma.toursPage.update({
        where: { id: toursPage.id },
        data: pageData,
      });
    } else {
      toursPage = await prisma.toursPage.create({
        data: pageData,
      });
    }

    revalidatePath('/tours');

    return NextResponse.json(toursPage);
  } catch (error) {
    console.error('[ToursPage PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar pagina de tours' },
      { status: 500 }
    );
  }
}
