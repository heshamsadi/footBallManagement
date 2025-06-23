## Summary

• Added click-to-add markers in back-office with modal for icon/layer selection, and marker rendering in both front-office and back-office.

## Directory tree

- 🆕 src/features/backoffice/components/MarkerModal.tsx
- ✏️ src/store/map.ts
- ✏️ src/components/MapWrapper.tsx
- ✏️ CHANGELOG.md

## File contents

**`src/features/backoffice/components/MarkerModal.tsx`**

```tsx
'use client';

import { useState } from 'react';
import useMapStore from '@/store/map';
import type { Marker } from '@/store/map';

interface MarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
}

export default function MarkerModal({ isOpen, onClose, lat, lng }: MarkerModalProps) {
  const { icons, addMarker } = useMapStore();
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedLayer, setSelectedLayer] = useState<'terrain' | 'hotel' | 'airport'>('terrain');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!selectedIcon) {
      // eslint-disable-next-line no-alert
      alert('Please select an icon');
      return;
    }

    const marker: Marker = {
      id: crypto.randomUUID(),
      lat,
      lng,
      icon: selectedIcon,
      layer: selectedLayer,
    };

    addMarker(marker);
    onClose();
    setSelectedIcon('');
    setSelectedLayer('terrain');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Add Marker</h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Position: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>

        <div className="mb-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="mb-2 block text-sm font-medium text-gray-700">Select Icon</label>
          <div className="grid max-h-32 grid-cols-3 gap-2 overflow-y-auto">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`relative rounded border p-2 ${
                  selectedIcon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${icon}`} alt={icon} className="mx-auto h-8 w-8" />
              </button>
            ))}
          </div>
          {icons.length === 0 && <p className="text-sm text-gray-500">No icons uploaded yet</p>}
        </div>

        <div className="mb-6">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="mb-2 block text-sm font-medium text-gray-700">Layer</label>
          <div className="space-y-2">
            {(['terrain', 'hotel', 'airport'] as const).map((layer) => (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label key={layer} className="flex items-center">
                <input
                  type="radio"
                  name="layer"
                  value={layer}
                  checked={selectedLayer === layer}
                  onChange={(e) => setSelectedLayer(e.target.value as typeof layer)}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{layer}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Marker
          </button>
        </div>
      </div>
    </div>
  );
}
```

**`src/store/map.ts`**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapConfig } from '@/lib/map/MapProvider';
import type { DistanceResult } from '@/lib/map/google/distance';

export type MapIcon = string; // filename in /public/icons

export interface DistanceRecord extends DistanceResult {
  id: string;
  date: string;
  origin: string;
  destination: string;
}

export interface Marker {
  id: string;
  lat: number;
  lng: number;
  icon: string;
  layer: 'terrain' | 'hotel' | 'airport';
}

interface LayerState {
  terrain: boolean;
  hotel: boolean;
  airport: boolean;
}

interface MapState extends MapConfig {
  icons: MapIcon[];
  distances: DistanceRecord[];
  markers: Marker[];
  layers: LayerState;
  setIcons: (icons: MapIcon[]) => void;
  addDistance: (record: DistanceRecord) => void;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;
  toggleLayer: (key: keyof LayerState) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setProvider: (provider: 'google' | 'mapbox') => void;
}

const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 14,
      provider: 'google',
      icons: [],
      distances: [],
      markers:
        typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('markers') || '[]') : [],
      layers: { terrain: true, hotel: true, airport: true },
      setIcons: (icons) => set({ icons }),
      addDistance: (record) => set((state) => ({ distances: [record, ...state.distances] })),
      addMarker: (marker) =>
        set((state) => {
          const newMarkers = [...state.markers, marker];
          if (typeof window !== 'undefined') {
            localStorage.setItem('markers', JSON.stringify(newMarkers));
          }
          return { markers: newMarkers };
        }),
      removeMarker: (id) =>
        set((state) => {
          const newMarkers = state.markers.filter((m) => m.id !== id);
          if (typeof window !== 'undefined') {
            localStorage.setItem('markers', JSON.stringify(newMarkers));
          }
          return { markers: newMarkers };
        }),
      toggleLayer: (key) =>
        set((state) => ({ layers: { ...state.layers, [key]: !state.layers[key] } })),
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setProvider: (provider) => {
        set({ provider });
        // Also persist to localStorage directly for immediate access
        if (typeof window !== 'undefined') {
          localStorage.setItem('map-provider', provider);
        }
      },
    }),
    {
      name: 'map-store', // unique name for localStorage key
      partialize: (state) => ({ provider: state.provider }), // only persist provider
    }
  )
);

export default useMapStore;
```

**`src/components/MapWrapper.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import useMapStore from '@/store/map';
import { mapProviderManager } from '@/lib/map/index';
import MarkerModal from '@/features/backoffice/components/MarkerModal';

export default function MapWrapper() {
  const mapRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const currentProvider = useRef<string>('');
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const pathname = usePathname();
  const isBackoffice = pathname === '/';

  const { center, zoom, provider, layers, markers } = useMapStore();

  // Initial map setup
  useEffect(() => {
    if (!mapRef.current || didInit.current) {
      return undefined;
    }

    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom);
        currentProvider.current = provider;
        didInit.current = true;

        // Add click handler for back-office
        if (isBackoffice) {
          const currentMapProvider = mapProviderManager.getCurrentProvider();
          if (currentMapProvider && 'map' in currentMapProvider) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const googleMap = (currentMapProvider as any).map;
            if (googleMap) {
              google.maps.event.addListener(
                googleMap,
                'click',
                (event: google.maps.MapMouseEvent) => {
                  if (event.latLng) {
                    setClickPosition({
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng(),
                    });
                    setIsModalOpen(true);
                  }
                }
              );
            }
          }
        }

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('map initialised');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    return () => {
      // Clear markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      mapProviderManager.destroy();
      didInit.current = false;
      currentProvider.current = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Handle provider changes (without remounting)
  useEffect(() => {
    if (!didInit.current || !mapRef.current || currentProvider.current === provider) {
      return;
    }

    const switchProvider = async () => {
      if (!mapRef.current) return;

      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom);
        currentProvider.current = provider;

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`switched to ${provider} provider`);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to switch map provider:', error);
      }
    };

    switchProvider();
  }, [provider, center, zoom]);

  // Update map when center/zoom changes
  useEffect(() => {
    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (currentMapProvider && didInit.current) {
      currentMapProvider.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (currentMapProvider && didInit.current) {
      currentMapProvider.setZoom(zoom);
    }
  }, [zoom]);

  // Handle layer changes (placeholder implementation)
  useEffect(() => {
    if (didInit.current && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Layer visibility changed:', layers);
      // TODO: Implement actual layer show/hide logic when map providers support it
    }
  }, [layers]);

  // Render markers on the map
  useEffect(() => {
    if (!didInit.current) return;

    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (!currentMapProvider || !('map' in currentMapProvider)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleMap = (currentMapProvider as any).map;
    if (!googleMap) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: googleMap,
        icon: {
          url: `/icons/${markerData.icon}`,
          scaledSize: new google.maps.Size(32, 32),
        },
        title: '', // No labels as per constraints
      });

      markersRef.current.push(marker);
    });
  }, [markers]);

  return (
    <>
      <div ref={mapRef} className="h-full w-full rounded-xl shadow" data-testid="map-container" />
      {isBackoffice && (
        <MarkerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          lat={clickPosition.lat}
          lng={clickPosition.lng}
        />
      )}
    </>
  );
}
```

**`CHANGELOG.md`**

```markdown
# 📜 Changelog

2025-06-23 – [agent] – Step A: Click-to-add markers – changes/2025-06-23_marker-placement.md
2025-06-23 – [agent] – Phase 4 Front-office slice – changes/2025-06-23_frontoffice-slice.md
2025-06-23 – [agent] – Phase 3 Distance + Dashboard – changes/2025-06-23_distance-dashboard.md
2025-06-22 – [agent] – Phase 2 Icon CRUD – changes/2025-06-22_icon-crud.md
2025-06-22 – [agent] – Hot-fix Jest google mock – changes/2025-06-22_hotfix-jest-google-mock.md
2025-06-22 – [agent] – Phase 1 Provider selector – src/features/backoffice/components/ProviderSelect.tsx, src/store/map.ts, src/lib/map/index.ts
2025-06-22 – [agent] – Phase 0 Back-office map scaffold – src/app/page.tsx, src/components/MapWrapper.tsx, src/lib/map/
2025-06-22 – [init] – Repo bootstrap via setup script – scaffold files
```
