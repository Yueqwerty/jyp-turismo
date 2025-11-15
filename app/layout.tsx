import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JYP Turismo - Central de Mensajería Unificada',
  description: 'Plataforma profesional para centralizar mensajes de WhatsApp Business, Facebook Messenger e Instagram',
  keywords: ['mensajería', 'WhatsApp Business', 'Messenger', 'Instagram', 'centralización'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
