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
