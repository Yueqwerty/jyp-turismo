import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// PUT - Actualizar configuraciones del sitio
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    let siteSettings = await prisma.siteSettings.findFirst();

    if (siteSettings) {
      siteSettings = await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: {
          logoText: data.logoText,
          companyName: data.companyName,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
          phone: data.phone,
          whatsappNumber: data.whatsappNumber,
          email: data.email,
          facebookUrl: data.facebookUrl,
          instagramUrl: data.instagramUrl,
        },
      });
    } else {
      siteSettings = await prisma.siteSettings.create({ data });
    }

    return NextResponse.json(siteSettings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuraciones' },
      { status: 500 }
    );
  }
}
