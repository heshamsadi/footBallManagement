import type { MapIcon } from '@/store/map';

export async function listIcons(): Promise<MapIcon[]> {
  const res = await fetch('/api/icons');
  return res.json();
}

export async function uploadIcon(file: File): Promise<MapIcon> {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch('/api/icons', { method: 'POST', body });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).name;
}

export async function deleteIcon(name: string) {
  await fetch(`/api/icons?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
}
