import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const IS_PRODUCTION = process.env.VERCEL === '1';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Generar nombre único
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${timestamp}-${originalName}`;

    if (IS_PRODUCTION) {
      // Producción: Usar Vercel Blob
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN no configurado');
      }

      const blob = await put(fileName, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return NextResponse.json({
        url: blob.url,
        fileName,
      });
    } else {
      // Desarrollo: Usar sistema de archivos local
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'images', 'tours');
      const filePath = path.join(uploadDir, fileName);

      // Crear directorio si no existe
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // El directorio ya existe
      }

      // Guardar archivo
      await writeFile(filePath, buffer);

      // Retornar URL pública
      const publicUrl = `/images/tours/${fileName}`;

      return NextResponse.json({
        url: publicUrl,
        fileName,
      });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
