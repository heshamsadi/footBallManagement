# 2025-06-23 – Places Right-click Settings & Search

## Summary
- **Marker modal now opens on right-click** (contextmenu) instead of left-click
- **Settings modal** for Places with configurable max results and min zoom levels
- **PlaceSearchBar component** with category filtering and temp cyan markers
- **Google Places InfoWindow** styling improved with black text
- **Places persistence** - markers persist while panning/zooming, only refresh when bounds hash changes
- **Temp marker system** for search results with auto-clear after 30 seconds

## Tree Structure
```
src/
  store/map.ts                                          # [MODIFIED] Added placesConfig, tempMarker state
  components/MapWrapperAdmin.tsx                        # [MODIFIED] Right-click modal, temp markers, improved Places logic
  features/backoffice/components/
    PlaceFilterTabs.tsx                                 # [MODIFIED] Added settings gear icon and modal
    PlacesSettingsModal.tsx                             # [NEW] Settings modal for Places config
    PlaceSearchBar.tsx                                  # [NEW] Global search bar with category filtering
  app/page.tsx                                          # [MODIFIED] Added PlaceSearchBar component
public/icons/
  gear.svg                                              # [NEW] Settings gear icon
  search_tmp.svg                                        # [NEW] Cyan temp marker for search results
```

## Modified Files

### src/store/map.ts
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

interface PlacesConfig {
  maxResults: number;
  minZoom: number;
}

interface MapState extends MapConfig {
  icons: MapIcon[];
  distances: DistanceRecord[];
  markers: Marker[];
  tempMarker: { lat: number; lng: number } | null;
  layers: LayerState;
  placesLayers: PlacesLayerState;
  placesConfig: PlacesConfig;
  showNativePoi: boolean;
  isLocationInitialized: boolean;
  setIcons: (icons: MapIcon[]) => void;
  addDistance: (record: DistanceRecord) => void;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;
  setTempMarker: (position: { lat: number; lng: number } | null) => void;
  toggleLayer: (key: keyof LayerState) => void;
  togglePlacesLayer: (key: keyof PlacesLayerState) => void;
  toggleNativePoi: () => void;
  setPlacesConfig: (config: Partial<PlacesConfig>) => void;
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
      tempMarker: null,
      layers: { terrain: true, hotel: true, airport: true },
      placesLayers: { hotel: false, restaurant: false, stadium: false },
      placesConfig: { maxResults: 20, minZoom: 14 },
      showNativePoi: false,
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
      setTempMarker: (position) => set({ tempMarker: position }),
      toggleLayer: (key) =>
        set((state) => ({ layers: { ...state.layers, [key]: !state.layers[key] } })),
      togglePlacesLayer: (key) =>
        set((state) => ({ placesLayers: { ...state.placesLayers, [key]: !state.placesLayers[key] } })),
      toggleNativePoi: () =>
        set((state) => ({ showNativePoi: !state.showNativePoi })),
      setPlacesConfig: (config) =>
        set((state) => ({ placesConfig: { ...state.placesConfig, ...config } })),
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

### src/features/backoffice/components/PlacesSettingsModal.tsx
```tsx
'use client';

import { useState } from 'react';
import useMapStore from '@/store/map';

interface PlacesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlacesSettingsModal({ isOpen, onClose }: PlacesSettingsModalProps) {
  const placesConfig = useMapStore(s => s.placesConfig);
  const setPlacesConfig = useMapStore(s => s.setPlacesConfig);
  
  const [maxResults, setMaxResults] = useState(placesConfig.maxResults);
  const [minZoom, setMinZoom] = useState(placesConfig.minZoom);

  if (!isOpen) return null;

  const handleSave = () => {
    setPlacesConfig({ maxResults, minZoom });
    onClose();
  };

  const handleCancel = () => {
    setMaxResults(placesConfig.maxResults);
    setMinZoom(placesConfig.minZoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Places Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="maxResults" className="block text-sm font-medium text-gray-700 mb-1">
              Max Results per Category
            </label>
            <input
              id="maxResults"
              type="number"
              min="5"
              max="50"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 10-30</p>
          </div>

          <div>
            <label htmlFor="minZoom" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Zoom Level
            </label>
            <input
              id="minZoom"
              type="number"
              min="10"
              max="18"
              value={minZoom}
              onChange={(e) => setMinZoom(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Places appear only when zoomed in past this level</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
```

### src/features/backoffice/components/PlaceSearchBar.tsx
```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import useMapStore from '@/store/map';

interface PlaceSearchBarProps {
  onPlaceSelected?: (place: google.maps.places.PlaceResult, location: { lat: number; lng: number }) => void;
}

const PLACE_CATEGORIES = [
  { key: 'hotel', label: 'Hotels', type: 'lodging' },
  { key: 'restaurant', label: 'Restaurants', type: 'restaurant' },
  { key: 'stadium', label: 'Stadiums', type: 'stadium' },
  { key: 'all', label: 'All Places', type: 'establishment' },
] as const;

export default function PlaceSearchBar({ onPlaceSelected }: PlaceSearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const { setCenter, setZoom, setTempMarker } = useMapStore();

  useEffect(() => {
    if (!inputRef.current || typeof google === 'undefined') return;

    // Initialize Google Places Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: selectedCategory === 'all' ? ['establishment'] : [PLACE_CATEGORIES.find(c => c.key === selectedCategory)?.type || 'establishment'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        
        // Pan map to location
        setCenter(location);
        setZoom(16);
        
        // Set temp marker
        setTempMarker(location);
        
        // Clear previous temp marker after 30 seconds
        setTimeout(() => {
          setTempMarker(null);
        }, 30000);
        
        // Call callback if provided
        if (onPlaceSelected) {
          onPlaceSelected(place, location);
        }
        
        // Clear search
        setQuery('');
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [selectedCategory, setCenter, setZoom, setTempMarker, onPlaceSelected]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Trigger autocomplete programmatically if needed
    // This is mainly for visual feedback
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex gap-2 mb-3">
        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {PLACE_CATEGORIES.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for places..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          🔍
        </button>
      </div>
      
      <p className="text-xs text-gray-500">
        Select a category and search for places. Click on a result to pan the map and drop a temporary marker.
      </p>
    </div>
  );
}
```

### public/icons/gear.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"></circle>
  <path d="M12 1v6m0 6v6"></path>
  <path d="m15.14 4.21 4.95 4.95-4.95 4.95"></path>
  <path d="m2.86 15.79 4.95-4.95-4.95-4.95"></path>
  <path d="M8 12H2m6 0h6m6 0h-6"></path>
</svg>
```

### public/icons/search_tmp.svg  
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="12" cy="12" r="10" fill="#00FFFF" stroke="#0080FF" stroke-width="2"/>
  <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
</svg>
```
