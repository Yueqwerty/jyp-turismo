import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// PUT - Actualizar footer
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });

    if (footerSettings) {
      footerSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: {
          brandTitle: data.brandTitle,
          brandDescription: data.brandDescription,
          copyrightText: data.copyrightText,
          termsUrl: data.termsUrl,
          privacyUrl: data.privacyUrl,
          cookiesUrl: data.cookiesUrl,
          newsletterEnabled: data.newsletterEnabled,
          newsletterTitle: data.newsletterTitle,
          newsletterPlaceholder: data.newsletterPlaceholder,
        },
      });
    } else {
      footerSettings = await prisma.footerSettings.create({ data });
    }

    return NextResponse.json(footerSettings);
  } catch (error) {
    console.error('Error updating footer settings:', error);
    return NextResponse.json(
      { error: 'Error al actualizar footer' },
      { status: 500 }
    );
  }
}
