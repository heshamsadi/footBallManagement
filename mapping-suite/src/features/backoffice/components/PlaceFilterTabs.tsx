'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { usePlacesLayers } from '@/hooks/usePlacesLayers';
import useMapStore from '@/store/map';
import PlacesSettingsModal from './PlacesSettingsModal';

const TABS = [
  { key: 'hotel', label: 'Hotels' },
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'stadium', label: 'Stadiums' },
] as const;

export default function PlaceFilterTabs() {
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { layers, toggle } = usePlacesLayers();
  
  const showNativePoi = useMapStore(s => s.showNativePoi);
  const toggleNativePoi = useMapStore(s => s.toggleNativePoi);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch during SSR
  if (!mounted) {
    return (
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className="rounded-full px-4 py-1 text-sm font-medium bg-primary text-white"
          >
            {t.label}
          </button>
        ))}        <button
          type="button"
          className="rounded-full px-4 py-1 text-sm font-medium bg-primary text-white"
        >
          Map POIs
        </button>
        <button
          type="button"
          className="rounded-full px-2 py-1 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          title="Places Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }
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
      {/* Native POI Toggle */}
      <button
        type="button"
        title="Toggle default Google POIs"
        onClick={toggleNativePoi}
        className={`rounded-full px-4 py-1 text-sm font-medium transition-colors duration-200 ${
          showNativePoi
            ? 'bg-white text-primary border border-primary shadow-sm'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        Map POIs
      </button>
      {/* Settings Button */}
      <button
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        className="rounded-full px-2 py-1 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
        title="Places Settings"
      >
        <Settings className="w-4 h-4" />
      </button>
      
      <PlacesSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
