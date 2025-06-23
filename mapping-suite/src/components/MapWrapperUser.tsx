'use client';

import { useEffect, useRef } from 'react';
import useMapStore from '@/store/map';
import { mapProviderManager } from '@/lib/map/index';

export default function MapWrapperUser() {
  const mapRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);
  const currentProvider = useRef<string>('');
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { center, zoom, provider, layers, markers, showNativePoi, initializeLocation } = useMapStore();

  // POI style for hiding/showing native POIs
  const HIDE_POI_STYLE = [{ featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] }];

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
        
        await mapProviderManager.switch(provider, mapRef.current, updatedCenter, zoom);
        currentProvider.current = provider;
        didInit.current = true;// Configure map for user (front-office) - locked by default

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
    });  }, [markers, layers]);

  // Handle native POI toggle
  useEffect(() => {
    if (!didInit.current) return;

    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (!currentMapProvider || !('map' in currentMapProvider)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleMap = (currentMapProvider as any).map;
    if (!googleMap) return;

    // Set map styles based on showNativePoi state
    googleMap.setOptions({ 
      styles: showNativePoi ? [] : HIDE_POI_STYLE 
    });
  }, [showNativePoi, HIDE_POI_STYLE]);

  return (
    <div ref={mapRef} className="h-full w-full rounded-xl shadow" data-testid="map-container-user" />
  );
}
