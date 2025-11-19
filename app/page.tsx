import { PrismaClient } from '@prisma/client';
import HomeClient from './home-client';

const prisma = new PrismaClient();

// Desactivar cache para siempre obtener datos frescos de la BD
export const revalidate = 0;

async function getContent() {
  // Obtener o crear configuraciones predeterminadas
  let siteSettings = await prisma.siteSettings.findFirst();
  if (!siteSettings) {
    siteSettings = await prisma.siteSettings.create({ data: {} });
  }

  let heroSection = await prisma.heroSection.findFirst({ where: { isActive: true } });
  if (!heroSection) {
    heroSection = await prisma.heroSection.create({ data: {} });
  }

  let toursSection = await prisma.toursSection.findFirst({ where: { isActive: true } });
  if (!toursSection) {
    toursSection = await prisma.toursSection.create({ data: {} });
  }

  const tours = await prisma.tour.findMany({
    where: {
      toursSectionId: toursSection.id,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  });

  let footerSettings = await prisma.footerSettings.findFirst({ where: { isActive: true } });
  if (!footerSettings) {
    footerSettings = await prisma.footerSettings.create({ data: {} });
  }

  return {
    siteSettings,
    heroSection,
    toursSection,
    tours,
    footerSettings,
  };
}

export default async function HomePage() {
  const content = await getContent();

  return (
    <HomeClient
      heroSection={content.heroSection}
      toursSection={content.toursSection}
      tours={content.tours}
      footerSettings={content.footerSettings}
      siteSettings={content.siteSettings}
    />
  );
}
