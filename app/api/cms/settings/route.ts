import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { siteSettingsSchema, validateInput } from '@/lib/validations/cms';

// GET - Get site settings
export async function GET() {
  try {
    let siteSettings = await prisma.siteSettings.findFirst();

    if (!siteSettings) {
      siteSettings = await prisma.siteSettings.create({ data: {} });
    }

    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error('[Settings GET] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuracion' },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateInput(siteSettingsSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let siteSettings = await prisma.siteSettings.findFirst();

    const { id, ...settingsData } = validation.data;

    if (siteSettings) {
      siteSettings = await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: settingsData,
      });
    } else {
      siteSettings = await prisma.siteSettings.create({
        data: settingsData,
      });
    }

    revalidatePath('/');

    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error('[Settings PUT] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuracion' },
      { status: 500 }
    );
  }
}
