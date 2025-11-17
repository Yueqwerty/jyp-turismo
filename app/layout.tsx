import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PrismaClient } from '@prisma/client';
import NextAuthSessionProvider from '@/components/providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

const prisma = new PrismaClient();

async function getMetadata(): Promise<Metadata> {
  try {
    const siteSettings = await prisma.siteSettings.findFirst();

    if (siteSettings) {
      return {
        title: siteSettings.metaTitle,
        description: siteSettings.metaDescription,
        keywords: siteSettings.metaKeywords.split(',').map(k => k.trim()),
      };
    }
  } catch (error) {
    console.error('Error loading metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'J&P Turismo - Transporte Patagonia Aysén',
    description: 'Transporte especializado desde Coyhaique hacia los destinos más icónicos de la Patagonia chilena',
    keywords: ['turismo', 'patagonia', 'aysén', 'transporte', 'glaciares', 'carretera austral'],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
