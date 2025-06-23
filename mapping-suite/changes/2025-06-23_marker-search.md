## Summary

• Split MapWrapper into MapWrapperAdmin (back-office with zoom/click) and MapWrapperUser (front-office with layer filtering)
• Added PlaceSearch component with Google Places Autocomplete for back-office
• Updated page wiring for back-office and front-office to use appropriate map wrappers

## Directory tree

- 🆕 src/components/MapWrapperAdmin.tsx
- 🆕 src/components/MapWrapperUser.tsx  
- 🆕 src/features/backoffice/components/PlaceSearch.tsx
- ✏️ src/app/page.tsx
- ✏️ src/app/frontoffice/page.tsx
- ✏️ CHANGELOG.md

## File contents

**`src/components/MapWrapperAdmin.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import useMapStore from '@/store/map';
import { mapProviderManager } from '@/lib/map/index';
import MarkerModal from '@/features/backoffice/components/MarkerModal';

export default function MapWrapperAdmin() {
  const mapRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const currentProvider = useRef<string>('');
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const { center, zoom, provider, markers } = useMapStore();

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

        // Add click handler for admin (back-office)
        const currentMapProvider = mapProviderManager.getCurrentProvider();
        if (currentMapProvider && 'map' in currentMapProvider) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const googleMap = (currentMapProvider as any).map;
          if (googleMap) {
            // Enable wheel zoom and gesture handling for admin
            googleMap.setOptions({
              scrollwheel: true,
              gestureHandling: 'auto',
            });

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

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('admin map initialised');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize admin map:', error);
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

  // Handle provider changes
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
          console.log(`admin switched to ${provider} provider`);
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
      <div ref={mapRef} className="h-full w-full rounded-xl shadow" data-testid="map-container-admin" />
      <MarkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lat={clickPosition.lat}
        lng={clickPosition.lng}
      />
    </>
  );
}
```

**`src/components/MapWrapperUser.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import useMapStore from '@/store/map';
import { mapProviderManager } from '@/lib/map/index';

export default function MapWrapperUser() {
  const mapRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const currentProvider = useRef<string>('');
  const markersRef = useRef<google.maps.Marker[]>([]);

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

        // Configure map for user (front-office) - locked as before
        const currentMapProvider = mapProviderManager.getCurrentProvider();
        if (currentMapProvider && 'map' in currentMapProvider) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const googleMap = (currentMapProvider as any).map;
          if (googleMap) {
            // Keep default locked behavior for user
            googleMap.setOptions({
              scrollwheel: false,
              gestureHandling: 'none',
              disableDefaultUI: true,
            });
          }
        }

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('user map initialised');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize user map:', error);
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

  // Handle provider changes
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
          console.log(`user switched to ${provider} provider`);
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

  // Render markers on the map (filtered by layers)
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

    // Add new markers (filtered by layer visibility)
    markers.forEach((markerData) => {
      // Only show markers if their layer is enabled
      if (layers[markerData.layer]) {
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
      }
    });
  }, [markers, layers]);

  return (
    <div ref={mapRef} className="h-full w-full rounded-xl shadow" data-testid="map-container-user" />
  );
}
```

**`src/features/backoffice/components/PlaceSearch.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { mapProviderManager } from '@/lib/map/index';
import useMapStore from '@/store/map';

export default function PlaceSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { setCenter, setZoom } = useMapStore();

  useEffect(() => {
    if (!inputRef.current) return;

    // Initialize Google Places Autocomplete
    const initAutocomplete = async () => {
      try {
        // Ensure Google Maps API is loaded
        if (typeof google === 'undefined' || !google.maps.places) {
          // Wait a bit and try again
          setTimeout(initAutocomplete, 100);
          return;
        }

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          types: ['establishment', 'geocode'],
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
        });

        autocompleteRef.current = autocomplete;

        // Handle place selection
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry || !place.geometry.location) {
            // eslint-disable-next-line no-console
            console.warn('No location data found for this place');
            return;
          }

          const latLng = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          // Update store and pan/zoom map
          setCenter(latLng);
          setZoom(15);

          // Also directly update the current map if available
          const currentProvider = mapProviderManager.getCurrentProvider();
          if (currentProvider) {
            currentProvider.setCenter(latLng);
            currentProvider.setZoom(15);
          }

          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('Place selected:', place.name, latLng);
          }
        });

      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize places autocomplete:', error);
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [setCenter, setZoom]);

  return (
    <div className="mb-4">
      <label htmlFor="place-search" className="block text-sm font-medium text-gray-700 mb-2">
        Search Places
      </label>
      <input
        ref={inputRef}
        id="place-search"
        type="text"
        placeholder="Search for a place..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
```

**`src/app/page.tsx`**

```tsx
import MapWrapperAdmin from '@/components/MapWrapperAdmin';
import ProviderSelect from '@/features/backoffice/components/ProviderSelect';
import PlaceSearch from '@/features/backoffice/components/PlaceSearch';
import IconManager from '@/features/backoffice/components/IconManager';
import DistancePanel from '@/features/backoffice/components/DistancePanel';
import DashboardTable from '@/features/backoffice/components/DashboardTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Back-office Map Demo</h1>
          <p className="mt-2 text-gray-600">
            Phase 1: Provider selector with Google Maps integration
          </p>
        </header>

        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 space-y-6">
            <ProviderSelect />
            <PlaceSearch />
            <IconManager />
            <DistancePanel />
            <DashboardTable />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="h-96 w-full">
            <MapWrapperAdmin />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**`src/app/frontoffice/page.tsx`**

```tsx
import MapWrapperUser from '@/components/MapWrapperUser';
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
        <MapWrapperUser />
      </div>

      <DashboardTable />
    </div>
  );
}
```
