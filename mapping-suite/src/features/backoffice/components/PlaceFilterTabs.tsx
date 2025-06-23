'use client';

import { usePlacesLayers } from '@/hooks/usePlacesLayers';

const TABS = [
  { key: 'hotel', label: 'Hotels' },
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'stadium', label: 'Stadiums' },
] as const;

export default function PlaceFilterTabs() {
  const { layers, toggle } = usePlacesLayers();

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => toggle(t.key)}
          className={`rounded-full px-4 py-1 text-sm font-medium transition-colors duration-200 ${
            layers[t.key]
              ? 'bg-white text-primary border border-primary shadow-sm'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
