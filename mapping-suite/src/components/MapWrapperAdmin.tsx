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
  const placesMarkersRef = useRef<Map<string, google.maps.Marker[]>>(new Map());  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const tempMarkerRef = useRef<google.maps.Marker | null>(null);
  const lastRequestTimestamp = useRef<Map<string, number>>(new Map());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const { center, zoom, provider, markers, tempMarker, placesLayers, showNativePoi, initializeLocation } = useMapStore();

  // POI style for hiding/showing native POIs
  const HIDE_POI_STYLE = [{ featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] }];

  // Type mapping for Google Places
  const placeTypeMapping = {
    hotel: 'lodging',
    restaurant: 'restaurant', 
    stadium: 'stadium'
  } as const;
  // Handle Places search based on current bounds and zoom
  const handlePlacesSearch = (googleMap: google.maps.Map) => {
    const { placesConfig } = useMapStore.getState();
    const currentZoom = googleMap.getZoom();
    
    if (!currentZoom || currentZoom < placesConfig.minZoom) {
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
      const cacheKey = `${boundsStr}:${category}:${placesConfig.minZoom}`;
      
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

          // Limit results to maxResults
          const limitedResults = results.slice(0, placesConfig.maxResults);
          
          // Create new markers
          const newMarkers: google.maps.Marker[] = [];
          limitedResults.forEach((place) => {
            if (place.geometry?.location) {              const marker = new google.maps.Marker({
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
                    (details, detailStatus) => {                      if (detailStatus === google.maps.places.PlacesServiceStatus.OK && details) {
                        const content = `
                          <div style="color:#222;font-family:Poppins,sans-serif;font-size:14px;max-width:200px;">
                            <strong style="color:#111;">${details.name || 'Unknown'}</strong><br>
                            <span style="color:#666;">${details.formatted_address || ''}</span><br>
                            ${details.rating ? `<span style="color:#333;">⭐ ${details.rating}</span>` : ''}
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
        didInit.current = true;        // Add click handler for admin (back-office)
        const currentMapProvider = mapProviderManager.getCurrentProvider();
        if (currentMapProvider && 'map' in currentMapProvider) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const googleMap = (currentMapProvider as any).map;
          if (googleMap) {
            // Initialize Places service and InfoWindow
            placesServiceRef.current = new google.maps.places.PlacesService(googleMap);
            infoWindowRef.current = new google.maps.InfoWindow();            // Only add right-click (contextmenu) handler for marker modal
            google.maps.event.addListener(
              googleMap,
              'contextmenu',
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

    initMap();    return () => {
      // Clear markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];      // Clear Places markers
      placesMarkersRef.current.forEach((markers) => {
        markers.forEach(marker => marker.setMap(null));
      });
      placesMarkersRef.current.clear();

      // Clear temp marker
      if (tempMarkerRef.current) {
        tempMarkerRef.current.setMap(null);
        tempMarkerRef.current = null;
      }

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

  // Handle temp marker changes
  useEffect(() => {
    if (!didInit.current) return;

    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (!currentMapProvider || !('map' in currentMapProvider)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleMap = (currentMapProvider as any).map;
    if (!googleMap) return;

    // Clear existing temp marker
    if (tempMarkerRef.current) {
      tempMarkerRef.current.setMap(null);
      tempMarkerRef.current = null;
    }

    // Add temp marker if position is set
    if (tempMarker) {
      tempMarkerRef.current = new google.maps.Marker({
        position: tempMarker,
        map: googleMap,
        icon: {
          url: '/icons/search_tmp.svg',
          scaledSize: new google.maps.Size(24, 24),
        },
        title: 'Search Result',
        animation: google.maps.Animation.DROP,
      });
    }
  }, [tempMarker]);

  // Handle Places layers changes
  useEffect(() => {
    if (!didInit.current) return;

    const currentMapProvider = mapProviderManager.getCurrentProvider();
    if (!currentMapProvider || !('map' in currentMapProvider)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleMap = (currentMapProvider as any).map;
    if (!googleMap) return;

    // Trigger Places search with current state
    handlePlacesSearch(googleMap);  }, [placesLayers]);

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
