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
      </label>      <input
        ref={inputRef}
        id="place-search"
        type="text"
        placeholder="Search for a place..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
      />
    </div>
  );
}
