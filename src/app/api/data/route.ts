import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'public', 'data');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const filePath = join(DATA_DIR, filename);
    const data = await readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filename, data } = await request.json();
    
    if (!filename || !data) {
      return NextResponse.json({ error: 'Filename and data are required' }, { status: 400 });
    }

    const filePath = join(DATA_DIR, filename);
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const id = searchParams.get('id');
    
    if (!filename || !id) {
      return NextResponse.json({ error: 'Filename and id are required' }, { status: 400 });
    }

    const filePath = join(DATA_DIR, filename);
    const data = JSON.parse(await readFile(filePath, 'utf8'));
    
    // Find the item to delete to get its image path
    const itemToDelete = data.find((item: any) => item.id === id);
    
    // Filter out the item
    const filteredData = data.filter((item: any) => item.id !== id);
    
    // Save updated data
    await writeFile(filePath, JSON.stringify(filteredData, null, 2), 'utf8');
    
    // Delete associated photo file if it exists
    if (itemToDelete && itemToDelete.image) {
      try {
        const photoPath = join(process.cwd(), 'public', itemToDelete.image);
        await unlink(photoPath);
        console.log(`Deleted photo: ${photoPath}`);
      } catch (photoError) {
        console.warn(`Could not delete photo: ${itemToDelete.image}`, photoError);
        // Don't fail the entire operation if photo deletion fails
      }
    }
    
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
