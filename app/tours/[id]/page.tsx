import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import TourDetailClient from './tour-detail-client';

const prisma = new PrismaClient();

// Deshabilitar caché
export const revalidate = 0;

interface PageProps {
  params: {
    id: string;
  };
}

async function getTour(id: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id, isActive: true },
      include: {
        toursSection: true,
      },
    });

    if (!tour) {
      return null;
    }

    return tour;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return settings;
}

export default async function TourDetailPage({ params }: PageProps) {
  const tour = await getTour(params.id);
  const siteSettings = await getSiteSettings();

  if (!tour) {
    notFound();
  }

  return <TourDetailClient tour={tour} siteSettings={siteSettings} />;
}
