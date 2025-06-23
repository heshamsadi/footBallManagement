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
