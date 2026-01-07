import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { footerSettingsSchema, validateInput } from '@/lib/validations/cms';

// GET - Get footer settings
export async function GET() {
  try {
    let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });

    if (!footerSettings) {
      footerSettings = await prisma.footerSettings.create({ data: {} });
    }

    return NextResponse.json(footerSettings);
  } catch (error) {
    console.error('[Footer GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener footer' },
      { status: 500 }
    );
  }
}

// PUT - Update footer settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateInput(footerSettingsSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });

    const { id, ...footerData } = validation.data;

    if (footerSettings) {
      footerSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: footerData,
      });
    } else {
      footerSettings = await prisma.footerSettings.create({
        data: footerData,
      });
    }

    revalidatePath('/');

    return NextResponse.json(footerSettings);
  } catch (error) {
    console.error('[Footer PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar footer' },
      { status: 500 }
    );
  }
}
