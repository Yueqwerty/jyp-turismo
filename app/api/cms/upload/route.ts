import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/validations/cms';

const IS_PRODUCTION = process.env.VERCEL === '1';

// Validate file type and size
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'Solo se permiten imagenes JPG, PNG o WebP' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'El archivo no puede superar 5MB' };
  }

  return { valid: true };
}

// Sanitize filename to prevent path traversal
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '')
    .toLowerCase();
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporciono archivo' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate safe filename
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const fileName = `${timestamp}-${sanitizedName}`;

    if (IS_PRODUCTION) {
      // Production: Use Vercel Blob Storage
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false,
      });

      return NextResponse.json({
        url: blob.url,
        fileName,
      });
    } else {
      // Development: Use local filesystem
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'images', 'tours');
      const filePath = path.join(uploadDir, fileName);

      // Verify path is within upload directory (prevent path traversal)
      const resolvedPath = path.resolve(filePath);
      const resolvedUploadDir = path.resolve(uploadDir);

      if (!resolvedPath.startsWith(resolvedUploadDir)) {
        return NextResponse.json(
          { error: 'Ruta de archivo invalida' },
          { status: 400 }
        );
      }

      // Create directory if needed
      await mkdir(uploadDir, { recursive: true });

      // Save file
      await writeFile(filePath, buffer);

      return NextResponse.json({
        url: `/images/tours/${fileName}`,
        fileName,
      });
    }
  } catch (error) {
    console.error('[Upload] Error:', error);
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
