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
