import { PrismaClient } from '@prisma/client';
import ToursClient from './tours-client';

const prisma = new PrismaClient();

export const revalidate = 0;

async function getAllTours() {
  try {
    const toursSection = await prisma.toursSection.findFirst({
      where: { isActive: true },
    });

    if (!toursSection) {
      return [];
    }

    const tours = await prisma.tour.findMany({
      where: {
        toursSectionId: toursSection.id,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    return tours;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return settings;
}

export default async function ToursPage() {
  const tours = await getAllTours();
  const siteSettings = await getSiteSettings();

  return <ToursClient tours={tours} siteSettings={siteSettings} />;
}
