// Next 14 App-Router REST handler – /api/icons
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const ICON_DIR = join(process.cwd(), 'public', 'icons');
const ALLOWED_TYPES = ['image/png', 'image/svg+xml'];

export async function GET() {
  try {
    const names = await fs.readdir(ICON_DIR);
    return NextResponse.json(names);
  } catch {
    // If directory doesn't exist, return empty array
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file || !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const ext = file.type === 'image/png' ? '.png' : '.svg';
  const name = `${crypto.randomUUID()}${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  // Ensure icons directory exists
  await fs.mkdir(ICON_DIR, { recursive: true });

  await fs.writeFile(join(ICON_DIR, name), Buffer.from(arrayBuffer));
  return NextResponse.json({ name });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  }

  await fs.unlink(join(ICON_DIR, name)).catch(() => {});
  return new NextResponse(null, { status: 204 });
}
