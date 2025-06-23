## Summary

• Added front-office slice with read-only map, layer toggles, and activity dashboard.

## Directory tree

- 🆕 src/hooks/useLayers.ts
- 🆕 src/features/frontoffice/components/LayerChecklist.tsx
- 🆕 src/features/frontoffice/components/DashboardTable.tsx
- 🆕 src/app/frontoffice/page.tsx
- ✏️ src/store/map.ts
- ✏️ src/components/MapWrapper.tsx
- ✏️ CHANGELOG.md

## File contents

**`src/hooks/useLayers.ts`**

```typescript
import useMapStore from '@/store/map';

export const useLayers = () =>
  useMapStore((s) => ({
    layers: s.layers,
    toggleLayer: s.toggleLayer,
  }));
```

**`src/features/frontoffice/components/LayerChecklist.tsx`**

```tsx
'use client';

import { useLayers } from '@/hooks/useLayers';

export default function LayerChecklist() {
  const { layers, toggleLayer } = useLayers();

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-3 text-lg font-medium text-gray-900">Map Layers</h3>
      <div className="space-y-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layers.terrain}
            onChange={() => toggleLayer('terrain')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${layers.terrain ? 'text-gray-900' : 'text-gray-400'}`}>
            Terrain
          </span>
        </label>

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layers.hotel}
            onChange={() => toggleLayer('hotel')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${layers.hotel ? 'text-gray-900' : 'text-gray-400'}`}>
            Hotels
          </span>
        </label>

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={layers.airport}
            onChange={() => toggleLayer('airport')}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${layers.airport ? 'text-gray-900' : 'text-gray-400'}`}>
            Airports
          </span>
        </label>
      </div>
    </div>
  );
}
```

**`src/features/frontoffice/components/DashboardTable.tsx`**

```tsx
'use client';

import useMapStore from '@/store/map';

export default function DashboardTable() {
  const { distances } = useMapStore();

  if (distances.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Activity Dashboard</h3>
        <div className="text-center">
          <p className="text-gray-500">No distance calculations recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Activity Dashboard</h3>

      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {distances.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">Distance Calculation</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-md">
                    <div className="truncate" title={`${record.origin} → ${record.destination}`}>
                      {record.origin} → {record.destination}
                    </div>
                    <div className="text-xs text-gray-500">
                      {record.km} km • {record.minutes} min
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**`src/app/frontoffice/page.tsx`**

```tsx
import MapWrapper from '@/components/MapWrapper';
import LayerChecklist from '@/features/frontoffice/components/LayerChecklist';
import DashboardTable from '@/features/frontoffice/components/DashboardTable';

export default function FrontOffice() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-3xl font-bold">Front-office Map</h1>

      <div className="mb-4 flex flex-col gap-4 lg:flex-row">
        <LayerChecklist />
      </div>

      <div className="mb-8 h-96 rounded-xl bg-white p-4 shadow">
        <MapWrapper />
      </div>

      <DashboardTable />
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

interface LayerState {
  terrain: boolean;
  hotel: boolean;
  airport: boolean;
}

interface MapState extends MapConfig {
  icons: MapIcon[];
  distances: DistanceRecord[];
  layers: LayerState;
  setIcons: (icons: MapIcon[]) => void;
  addDistance: (record: DistanceRecord) => void;
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
      layers: { terrain: true, hotel: true, airport: true },
      setIcons: (icons) => set({ icons }),
      addDistance: (record) => set((state) => ({ distances: [record, ...state.distances] })),
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

import { useEffect, useRef } from 'react';
import useMapStore from '@/store/map';
import { mapProviderManager } from '@/lib/map/index';

export default function MapWrapper() {
  const mapRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const currentProvider = useRef<string>('');

  const { center, zoom, provider, layers } = useMapStore();

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

  return (
    <div ref={mapRef} className="h-full w-full rounded-xl shadow" data-testid="map-container" />
  );
}
```

**`CHANGELOG.md`**

```markdown
# 📜 Changelog

2025-06-23 – [agent] – Phase 4 Front-office slice – changes/2025-06-23_frontoffice-slice.md
2025-06-23 – [agent] – Phase 3 Distance + Dashboard – changes/2025-06-23_distance-dashboard.md
2025-06-22 – [agent] – Phase 2 Icon CRUD – changes/2025-06-22_icon-crud.md
2025-06-22 – [agent] – Hot-fix Jest google mock – changes/2025-06-22_hotfix-jest-google-mock.md
2025-06-22 – [agent] – Phase 1 Provider selector – src/features/backoffice/components/ProviderSelect.tsx, src/store/map.ts, src/lib/map/index.ts
2025-06-22 – [agent] – Phase 0 Back-office map scaffold – src/app/page.tsx, src/components/MapWrapper.tsx, src/lib/map/
2025-06-22 – [init] – Repo bootstrap via setup script – scaffold files
```
