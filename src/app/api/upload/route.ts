import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const PHOTOS_DIR = join(process.cwd(), 'public', 'photos');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Ensure photos directory exists
    await mkdir(PHOTOS_DIR, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `photo_${timestamp}.${extension}`;
    const filepath = join(PHOTOS_DIR, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compress and resize image if it's an image
    if (file.type.startsWith('image/')) {
      try {
        // Use sharp to compress and resize the image
        const processedBuffer = await sharp(buffer)
          .resize(800, 800, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 80 })
          .toBuffer();
        
        await writeFile(filepath, processedBuffer);
      } catch (sharpError) {
        console.warn('Sharp processing failed, saving original file:', sharpError);
        // Fallback to original file if sharp fails
        await writeFile(filepath, buffer);
      }
    } else {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Return the public URL
    const publicUrl = `/photos/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
