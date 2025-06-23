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
  const inputRef = useRef<HTMLInputElement>(null);  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
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

    autocompleteRef.current = autocomplete;    return () => {
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
        {/* Category Selector */}        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
        >
          {PLACE_CATEGORIES.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="flex-1 relative">          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for places..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
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
