import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { heroSectionSchema, validateInput } from '@/lib/validations/cms';

// GET - Get hero section
export async function GET() {
  try {
    let heroSection = await prisma.heroSection.findFirst({ where: { isActive: true } });

    if (!heroSection) {
      heroSection = await prisma.heroSection.create({ data: {} });
    }

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('[Hero GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener hero section' },
      { status: 500 }
    );
  }
}

// PUT - Update hero section
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateInput(heroSectionSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let heroSection = await prisma.heroSection.findFirst({ where: { isActive: true } });

    const { id, ...heroData } = validation.data;

    if (heroSection) {
      heroSection = await prisma.heroSection.update({
        where: { id: heroSection.id },
        data: heroData,
      });
    } else {
      heroSection = await prisma.heroSection.create({
        data: heroData,
      });
    }

    revalidatePath('/');

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error('[Hero PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar hero section' },
      { status: 500 }
    );
  }
}
