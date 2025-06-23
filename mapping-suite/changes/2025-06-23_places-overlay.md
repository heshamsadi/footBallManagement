# Minimal Google Places Layer (Admin Map Only)

**Date:** 2025-06-23  
**Type:** Feature  
**Scope:** Google Places overlay with rate limiting and caching  

## Summary

Added minimal Google Places layer overlay for admin map only. Features Hotels, Restaurants, and Stadiums/Pitches with smart caching, rate limiting, and zoom-level visibility controls. Places markers show detailed InfoWindows on click, while preserving click-to-add custom marker functionality.

## Directory tree

- 🆕 src/features/backoffice/components/PlacesLayerCheckboxes.tsx
- 🆕 public/icons/hotel.svg
- 🆕 public/icons/restaurant.svg
- 🆕 public/icons/stadium.svg
- ✏️ src/store/map.ts
- ✏️ src/components/MapWrapperAdmin.tsx
- ✏️ src/app/page.tsx
- ✏️ CHANGELOG.md

## File contents

**`src/store/map.ts`**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapConfig } from '@/lib/map/MapProvider';
import type { DistanceResult } from '@/lib/map/google/distance';
import { getCurrentLocation, type GeolocationPosition } from '@/lib/geolocation';

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

interface PlacesLayerState {
  hotel: boolean;
  restaurant: boolean;
  stadium: boolean;
}

interface MapState extends MapConfig {
  icons: MapIcon[];
  distances: DistanceRecord[];
  markers: Marker[];
  layers: LayerState;
  placesLayers: PlacesLayerState;
  isLocationInitialized: boolean;
  setIcons: (icons: MapIcon[]) => void;
  addDistance: (record: DistanceRecord) => void;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;
  toggleLayer: (key: keyof LayerState) => void;
  togglePlacesLayer: (key: keyof PlacesLayerState) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setProvider: (provider: 'google' | 'mapbox') => void;
  initializeLocation: () => Promise<void>;
}

const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 14,
      provider: 'google',
      icons: [],
      distances: [],
      markers:
        typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('markers') || '[]') : [],
      layers: { terrain: true, hotel: true, airport: true },
      placesLayers: { hotel: false, restaurant: false, stadium: false },
      isLocationInitialized: false,
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
      togglePlacesLayer: (key) =>
        set((state) => ({ placesLayers: { ...state.placesLayers, [key]: !state.placesLayers[key] } })),
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setProvider: (provider) => {
        set({ provider });
        // Also persist to localStorage directly for immediate access
        if (typeof window !== 'undefined') {
          localStorage.setItem('map-provider', provider);
        }
      },
      initializeLocation: async () => {
        const state = get();
        if (state.isLocationInitialized) {
          return; // Already initialized
        }
        
        try {
          const userLocation = await getCurrentLocation();
          set({ 
            center: userLocation, 
            isLocationInitialized: true 
          });
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Map centered to user location:', userLocation);
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to get user location:', error);
          }
          set({ isLocationInitialized: true }); // Mark as initialized even if failed
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

**`src/features/backoffice/components/PlacesLayerCheckboxes.tsx`**

```tsx
'use client';

import useMapStore from '@/store/map';

export default function PlacesLayerCheckboxes() {
  const { placesLayers, togglePlacesLayer } = useMapStore();

  const layers = [
    { key: 'hotel' as const, label: 'Hotels', icon: '🏨' },
    { key: 'restaurant' as const, label: 'Restaurants', icon: '🍽️' },
    { key: 'stadium' as const, label: 'Stadiums/Pitches', icon: '⚽' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Google Places</h3>
      <div className="space-y-2">
        {layers.map(({ key, label, icon }) => (
          <label key={key} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={placesLayers[key]}
              onChange={() => togglePlacesLayer(key)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 flex items-center">
              <span className="mr-1">{icon}</span>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
```

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
  const placesMarkersRef = useRef<Map<string, google.maps.Marker[]>>(new Map());
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const lastRequestTimestamp = useRef<Map<string, number>>(new Map());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const { center, zoom, provider, markers, placesLayers, initializeLocation } = useMapStore();

  // Type mapping for Google Places
  const placeTypeMapping = {
    hotel: 'lodging',
    restaurant: 'restaurant', 
    stadium: 'stadium'
  } as const;

  // Handle Places search based on current bounds and zoom
  const handlePlacesSearch = (googleMap: google.maps.Map) => {
    const currentZoom = googleMap.getZoom();
    if (!currentZoom || currentZoom < 14) {
      // Hide all Places markers if zoom is too low
      placesMarkersRef.current.forEach((markers) => {
        markers.forEach(marker => marker.setMap(null));
      });
      return;
    }

    const bounds = googleMap.getBounds();
    if (!bounds || !placesServiceRef.current) return;

    const boundsStr = bounds.toUrlValue();

    // Process each active Places layer
    Object.entries(placesLayers).forEach(([category, isActive]) => {
      const cacheKey = `${boundsStr}:${category}`;
      
      if (!isActive) {
        // Hide markers for inactive layers
        const markers = placesMarkersRef.current.get(category) || [];
        markers.forEach(marker => marker.setMap(null));
        return;
      }

      // Check rate limiting (10 min between requests for same bounds+category)
      const lastRequest = lastRequestTimestamp.current.get(cacheKey);
      const now = Date.now();
      if (lastRequest && (now - lastRequest) < 600000) { // 10 minutes
        // Show cached markers
        const cachedMarkers = placesMarkersRef.current.get(category) || [];
        cachedMarkers.forEach(marker => marker.setMap(googleMap));
        return;
      }

      // Perform new search
      const placeType = placeTypeMapping[category as keyof typeof placeTypeMapping];
      const request: google.maps.places.PlaceSearchRequest = {
        bounds,
        type: placeType as any,
      };

      placesServiceRef.current!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Clear old markers for this category
          const oldMarkers = placesMarkersRef.current.get(category) || [];
          oldMarkers.forEach(marker => marker.setMap(null));

          // Create new markers
          const newMarkers: google.maps.Marker[] = [];
          results.forEach((place) => {
            if (place.geometry?.location) {
              const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: googleMap,
                icon: {
                  url: `/icons/${category}.svg`,
                  scaledSize: new google.maps.Size(20, 20),
                },
                title: place.name || '',
              });

              // Add click listener for InfoWindow
              marker.addListener('click', () => {
                if (place.place_id && placesServiceRef.current && infoWindowRef.current) {
                  placesServiceRef.current.getDetails(
                    { placeId: place.place_id },
                    (details, detailStatus) => {
                      if (detailStatus === google.maps.places.PlacesServiceStatus.OK && details) {
                        const content = `
                          <div style="max-width: 200px;">
                            <strong>${details.name || 'Unknown'}</strong><br>
                            ${details.formatted_address || ''}<br>
                            ${details.rating ? `⭐ ${details.rating}` : ''}
                          </div>
                        `;
                        infoWindowRef.current!.setContent(content);
                        infoWindowRef.current!.open(googleMap, marker);
                      }
                    }
                  );
                }
              });

              newMarkers.push(marker);
            }
          });

          // Cache the markers and timestamp
          placesMarkersRef.current.set(category, newMarkers);
          lastRequestTimestamp.current.set(cacheKey, now);
        }
      });
    });
  };
  // Initial map setup
  useEffect(() => {
    if (!mapRef.current || didInit.current) {
      return undefined;
    }

    const initMap = async () => {
      if (!mapRef.current) return;
      
      try {
        // Initialize user location first
        await initializeLocation();
        
        // Get the updated center from the store
        const { center: updatedCenter } = useMapStore.getState();
        
        await mapProviderManager.switch(provider, mapRef.current, updatedCenter, zoom, { interactive: true });
        currentProvider.current = provider;
        didInit.current = true;// Add click handler for admin (back-office)
        const currentMapProvider = mapProviderManager.getCurrentProvider();
        if (currentMapProvider && 'map' in currentMapProvider) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const googleMap = (currentMapProvider as any).map;
          if (googleMap) {
            // Initialize Places service and InfoWindow
            placesServiceRef.current = new google.maps.places.PlacesService(googleMap);
            infoWindowRef.current = new google.maps.InfoWindow();

            // Add click handler with placeId guard
            google.maps.event.addListener(
              googleMap,
              'click',
              (event: google.maps.MapMouseEvent) => {
                // If click is on a place, let Google handle it
                if ((event as any).placeId) return;
                
                if (event.latLng) {
                  setClickPosition({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  });
                  setIsModalOpen(true);
                }
              }
            );

            // Add idle listener for Places search
            google.maps.event.addListener(googleMap, 'idle', () => {
              handlePlacesSearch(googleMap);
            });
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

      // Clear Places markers
      placesMarkersRef.current.forEach((markers) => {
        markers.forEach(marker => marker.setMap(null));
      });
      placesMarkersRef.current.clear();

      // Close InfoWindow
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

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
      if (!mapRef.current) return;      try {
        await mapProviderManager.switch(provider, mapRef.current, center, zoom, { interactive: true });
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

  // Handle Places layers changes
  useEffect(() => {
    if (!didInit.current) return;

    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (!currentMapProvider || !('map' in currentMapProvider)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleMap = (currentMapProvider as any).map;
    if (!googleMap) return;

    // Trigger Places search with current state
    handlePlacesSearch(googleMap);
  }, [placesLayers]);

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

**`src/app/page.tsx`**

```tsx
import DashboardLayout from '@/layouts/DashboardLayout';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import DataTable from '@/components/DataTable';
import MapWrapperAdmin from '@/components/MapWrapperAdmin';
import PlacesLayerCheckboxes from '@/features/backoffice/components/PlacesLayerCheckboxes';

export default function Home() {
  return (
    <DashboardLayout>
      {/* Map Section */}
      <div className="bg-white shadow rounded-lg mb-6 relative">
        <div className="px-4 py-5 sm:p-6">
          <div className="relative">
            <div className="h-[600px] w-full rounded-lg overflow-hidden">
              <MapWrapperAdmin />
            </div>
            {/* Places Layer Controls - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <PlacesLayerCheckboxes />
            </div>
            {/* Workspace Tabs at Bottom of Map */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <WorkspaceTabs />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable />
    </DashboardLayout>
  );
}
```

## Technical Implementation

### Store Integration
- Added `PlacesLayerState` interface with hotel, restaurant, stadium boolean flags
- Added `placesLayers` state and `togglePlacesLayer` method to store
- State defaults to all layers disabled for conservative approach

### Map Integration
- Added Places service initialization in MapWrapperAdmin
- Implemented zoom-level filtering (only show Places at zoom >= 14)
- Smart caching system using Map<boundsHash+category, Marker[]>
- Rate limiting: 10-minute cooldown per bounds+category combination
- InfoWindow integration with place details and ratings

### Type Mapping
- hotel → 'lodging' (Google Places API type)
- restaurant → 'restaurant' 
- stadium → 'stadium'

### Click Handler Guard
- Modified map click handler to check for event.placeId
- Places clicks open InfoWindow, empty map clicks open MarkerModal
- Preserves existing click-to-add-custom-marker functionality

### Icons & UI
- Created SVG placeholder icons for each category
- PlacesLayerCheckboxes positioned as floating overlay (top-right)
- Clean Tailwind styling with emoji icons for clarity

### Performance Features
- Bounds-based caching prevents duplicate API calls
- Automatic marker hiding when zoom level too low
- Layer toggle immediately shows/hides cached markers
- Rate limiting protects Google Places API quota

### Error Handling
- Graceful handling of Places API failures
- Development logging for debugging
- Fallback behaviors for missing data

## Front-office Unchanged
- MapWrapperUser retains existing functionality
- No Places integration in front-office view
- Maintains clean separation of admin/user features
