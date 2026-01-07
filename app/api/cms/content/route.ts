import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Parallel fetching for better performance
    const [
      siteSettings,
      heroSection,
      toursSection,
      footerSettings,
      toursPage,
    ] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.heroSection.findFirst({ where: { isActive: true } }),
      prisma.toursSection.findFirst({ where: { isActive: true } }),
      prisma.footerSettings.findFirst({ where: { isActive: true } }),
      prisma.toursPage.findFirst({ where: { isActive: true } }),
    ]);

    // Create defaults if not exist (upsert pattern)
    const [
      finalSiteSettings,
      finalHeroSection,
      finalToursSection,
      finalFooterSettings,
      finalToursPage,
    ] = await Promise.all([
      siteSettings ?? prisma.siteSettings.create({ data: {} }),
      heroSection ?? prisma.heroSection.create({ data: {} }),
      toursSection ?? prisma.toursSection.create({ data: {} }),
      footerSettings ?? prisma.footerSettings.create({ data: {} }),
      toursPage ?? prisma.toursPage.create({ data: {} }),
    ]);

    // Fetch tours after we have toursSection
    const tours = await prisma.tour.findMany({
      where: {
        toursSectionId: finalToursSection.id,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      siteSettings: finalSiteSettings,
      heroSection: finalHeroSection,
      toursSection: finalToursSection,
      tours,
      footerSettings: finalFooterSettings,
      toursPage: finalToursPage,
    });
  } catch (error) {
    console.error('[CMS Content] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}
