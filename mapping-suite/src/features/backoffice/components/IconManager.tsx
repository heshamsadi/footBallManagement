'use client';

import { useCallback, useEffect, useRef } from 'react';
import useMapStore from '@/store/map';
import { listIcons, uploadIcon, deleteIcon } from '@/lib/api/icons';

export default function IconManager() {
  const { icons, setIcons } = useMapStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** initial fetch */
  useEffect(() => {
    listIcons()
      .then(setIcons)
      .catch(() => {
        // Silently fail - icons are optional
      });
  }, [setIcons]);

  /** choose file */
  const onSelect = useCallback(async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    try {
      const name = await uploadIcon(file);
      setIcons([...icons, name]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, [icons, setIcons]);

  /** delete */
  const onDelete = useCallback(
    async (name: string) => {
      await deleteIcon(name);
      setIcons(icons.filter((n) => n !== name));
    },
    [icons, setIcons]
  );
  return (
    <section className="space-y-4">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Upload custom icon</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.svg"
          onChange={onSelect}
          className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-sm"
          data-testid="icon-input"
        />
      </label>

      <div className="grid grid-cols-3 gap-4">
        {icons.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onDelete(name)}
            className="relative rounded border p-2 shadow hover:bg-gray-50"
            data-testid={`icon-${name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/${name}`} alt={name} className="mx-auto h-12 w-12" />
            <span className="absolute right-1 top-1 text-xs text-red-500">✕</span>
          </button>
        ))}
      </div>
    </section>
  );
}
